class Admin::DoctorSerializer < Admin::BaseSerializer
  attributes :email, :first_name, :last_name, :name, :active?, :profile

end