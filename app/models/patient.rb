class Patient < ActiveRecord::Base
  # Информация о пациенте
  include Attachable
  include Alertable

  default_scope -> { order(:updated_at => :desc)}
  scope :archivated, -> { where(in_archive: true) }

  enum gender: [:male, :female]

  has_many :visits, dependent: :destroy
  has_many :contacts, as: :contactable, dependent: :destroy
  belongs_to :doctor
  has_many :journals

  # validates_uniqueness_of :full_name, scope: :doctor_id

  before_create :set_color
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

  def set_color
    self.color = Color.get_random_color
  end
end
