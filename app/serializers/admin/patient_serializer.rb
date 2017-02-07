class Admin::PatientSerializer < Admin::BaseSerializer
  attributes :email, :full_name, :doctor_name

  def doctor_name
    object.try(:doctor).try(:full_name)
  end
end