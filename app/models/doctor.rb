class Doctor < ActiveRecord::Base
  include Attachable
  include Alertable

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  enum gender: [:male, :female]
  enum office: [:office_open, :office_closed]
  enum profile: [:profile_open, :profile_closed]

  has_many :contacts, as: :contactable, dependent: :destroy
  has_many :visits, dependent: :destroy
  has_many :appointments
  has_many :patients, through: :appointments
  has_many :work_schedules, dependent: :destroy

  before_destroy :destroy_avatars

  [:avatar, :public_avatar].map do |attribute_name|
    define_method "change_#{attribute_name}" do |file_params|
      attach(attribute_name, file_params)
    end

    define_method "destroy_#{attribute_name}" do
      detach(attribute_name)
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
