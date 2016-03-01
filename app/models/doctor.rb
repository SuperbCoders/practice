class Doctor < ActiveRecord::Base
  include Attachable
  include Alertable

  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable,
         omniauth_providers: %w(facebook vkontakte)

  include SuperbAuth::Concerns::Omniauthable

  enum gender: [:male, :female]
  enum office: [:office_open, :office_closed]
  enum profile: [:profile_open, :profile_closed]

  has_many :contacts, as: :contactable, dependent: :destroy
  has_many :visits, dependent: :destroy
  has_many :appointments
  has_many :patients, through: :appointments
  has_many :work_schedules, dependent: :destroy

  validates_uniqueness_of :username

  before_destroy :destroy_avatars

  [:avatar, :public_avatar].map do |attribute_name|
    define_method "change_#{attribute_name}" do |file_params|
      attach(attribute_name, file_params)
    end

    define_method "destroy_#{attribute_name}" do
      detach(attribute_name)
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

end
