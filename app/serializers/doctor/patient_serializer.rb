class Doctor::PatientSerializer < Admin::BaseSerializer
  attributes :name

  def name
    object.try(:email)
  end
end