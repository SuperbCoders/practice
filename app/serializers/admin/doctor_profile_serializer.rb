class Admin::DoctorProfileSerializer < Admin::BaseSerializer
  attributes :first_name, :last_name, :name, :age, :gender
end