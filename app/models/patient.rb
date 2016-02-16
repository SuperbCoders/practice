class Patient < User

  has_one :patient_profile

  def profile
    patient_profile
  end

end