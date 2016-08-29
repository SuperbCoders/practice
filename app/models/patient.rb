class Patient < ActiveRecord::Base
  # Информация о пациенте
  include Attachable
  include Alertable

  devise :database_authenticatable, :registerable,
      :recoverable, :rememberable, :trackable, :validatable

  enum gender: [:male, :female]

  has_many :visits, dependent: :destroy
  has_many :contacts, as: :contactable, dependent: :destroy
  has_many :appointments
  has_many :journals

  before_destroy :destroy_avatar

  [:avatar].map do |attribute_name|
    define_method "change_#{attribute_name}" do |file_params|
      attach(attribute_name, file_params)
    end

    define_method "destroy_#{attribute_name}" do
      detach(attribute_name)
    end
  end

  private

  def self.temporary_password
    SecureRandom.hex.to_s[0..8]
  end

  def self.temporary_email
    "#{temporary_password}@practice.com"
  end
end