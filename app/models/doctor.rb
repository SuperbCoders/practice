require 'json'

class Doctor < ActiveRecord::Base
  include Attachable
  include Alertable

  devise :database_authenticatable, :registerable,  :confirmable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable,
         omniauth_providers: %w(facebook vkontakte)

  enum gender: [:male, :female]
  enum office: [:office_open, :office_closed]
  enum profile: [:profile_open, :profile_closed]

  has_many :contacts, as: :contactable, dependent: :destroy
  has_many :visits, dependent: :destroy
  has_many :appointments
  has_many :patients, through: :appointments
  has_many :identities, dependent: :destroy
  has_many :work_schedules, dependent: :destroy
  has_many :journals
  has_many :dicts, as: :dictable, dependent: :destroy
  has_one :setting
  
  after_create :create_identity

  # todo: Пока не ясно нужно вообще это поле или нет. 
  # validates_uniqueness_of :username

  before_destroy :destroy_avatars

  def find_patient(email)
    patient = Patient.find_by(email: email)

    if patient
      return patient if appointments.find_or_create_by(patient: patient)
    end
  end

  def avatar_from_url(url)
    destroy_avatar
    file_extension = 'png'
    new_file_name = "#{SecureRandom.hex}.#{file_extension}"

    logger.info "Download avatar from #{url}"

    if ['jpg','png','jpeg'].map(&:upcase).include? url.split('.')[-1].upcase
      file_extension = url.split('.')[-1]
    end

    begin
      res = open(url)
      if res.status[0].eql? '200'

        File.open("#{Rails.application.config.upload_path}/#{new_file_name}", 'wb') { |f|
          if f.write(res.read)
            relative_name = "/" + Pathname.new(f.path).relative_path_from(Rails.public_path).to_s
            return update_attributes(avatar: relative_name)
          end
        }
      end

    rescue Exception => e
      logger.debug "#{e.inspect}"
    end
  end

  def get_settings
    Setting.find_or_create_by(doctor: self)
  end

  def self.from_omniauth(auth)
    identity = Identity.find_for_oauth(auth)
    user = identity.doctor

    unless user
      user = Doctor.new
      user.email = auth.info.email.downcase if auth.info.email
      user.password = Patient.temporary_password
      user.username = auth.extra.raw_info.id

      case auth.provider
        when 'facebook'
          user.avatar_from_url("https://graph.facebook.com/#{auth.extra.raw_info.id}/picture?type=large")
          user.first_name = auth.info.name
        when 'vkontakte'
          user.avatar_from_url(auth.extra.raw_info.photo_200_orig) if auth.extra.raw_info.photo_200_orig
          user.first_name = auth.info.first_name
          user.last_name = auth.info.last_name
      end
      user.save
    end
    user
  end

  def public_visits(date_from, date_to)
    public_visits = []
    visits.where("start_at > ?", date_from).map { |visit|
      if visit.end < date_to.to_datetime
        public_visits << {start: visit.start, end: visit.end, duration: visit.duration }
      end
    }
    public_visits
  end

  def phone
    if contacts.phone.count > 0
      contacts.phone.first.data
    end
  end

  def name
    if first_name or last_name
      [first_name, last_name].join ' '
    else
      email
    end
  end

  def default_visit_duration
    30
  end

  def destroy_avatars
    destroy_avatar
    destroy_public_avatar
  end

  [:avatar, :public_avatar].map do |attribute_name|
    define_method "change_#{attribute_name}" do |file_params|
      attach(attribute_name, file_params)
    end

    define_method "destroy_#{attribute_name}" do
      detach(attribute_name)
    end
  end

  protected
  def create_identity(oauth_data = nil)
    unless session[:oauth] || oauth_data
      return
    end

    auth = JSON.parse(session[:oauth].to_json, object_class: OpenStruct)
    identity = Identity.find_for_oauth(oauth_data || auth)
    session[:oauth] = nil

    identity.update_attributes({
      doctor_id: id,
      email: email.downcase,
      oauth_token: auth.credentials.token,
      oauth_expires_at: Time.at(auth.credentials.expires_at)
    })

  end

end
