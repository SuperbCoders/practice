class Doctor < ActiveRecord::Base
  include Attachable
  include Alertable

  devise :database_authenticatable, :registerable, :omniauthable,
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

  validates_uniqueness_of :username

  before_destroy :destroy_avatars

  def avatar_from_url(url)
    destroy_avatar
    upload_path = Rails.application.config.upload_path
    file_extension = 'png'
    new_file_name = "#{SecureRandom.hex}.#{file_extension}"

    # https://pp.vk.me/c629430/v629430842/212e1/78Dj1AOMhs4.jpg

    if ['jpg','png','jpeg'].map(&:upcase).include? url.split('.')[-1].upcase
      file_extension = url.split('.')[-1]
    end

    begin
      res = open(url)
      if res.status[0].eql? '200'

        File.open("#{upload_path}/#{new_file_name}", 'wb') { |f|
          if f.write(res.read)
            return update_attributes(avatar: new_file_name)
          end
        }
      end

    rescue Exception => e
      logger.debug "#{e.inspect}"
    end
  end

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_initialize.tap do |user|
      if user.new_record?
        user.email = auth.info.email.downcase
        user.password = Patient.temporary_password
        user.first_name = auth.info.first_name
        user.last_name = auth.info.last_name
        user.username = auth.extra.raw_info.id

        if user.save
          i = user.identities.find_or_create_by(
              provider: auth.provider,
              email: auth.info.email.downcase,
              uid: auth.extra.raw_info.id,
              full_name: auth.info.name,
              oauth_token: auth.credentials.token,
              oauth_expires_at: Time.at(auth.credentials.expires_at)
          )
          logger.info "Identity #{i.to_json}"
          logger.info "Identity #{i.errors.full_messages}"
        end
      end

      if user.valid?
        case auth.provider
          when 'facebook'
            user.avatar_from_url("https://graph.facebook.com/#{auth.extra.raw_info.id}/picture?type=large")
          when 'vkontakte'
            user.avatar_from_url(auth.extra.raw_info.photo_200_orig) if auth.extra.raw_info.photo_200_orig
        end
      end

      user
    end
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

end
