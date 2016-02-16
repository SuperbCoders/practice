class Doctor < User
  has_one :doctor_profile
  has_many :visits

  def profile
    doctor_profile
  end
end