class Admin::DoctorSerializer < Admin::BaseSerializer
  attributes :email

  has_one :doctor_profile, serializer: Admin::DoctorProfileSerializer
end