class Doctor < User
  has_one :doctor_profile
  has_many :visits

  def profile=(prof)
    doctor_profile = prof
  end

  def profile
    doctor_profile
  end

  private

end
