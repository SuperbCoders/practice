class Doctor::PatientSerializer < Doctor::BaseSerializer
  attributes :name

  def name
    object.try(:email)
  end
end