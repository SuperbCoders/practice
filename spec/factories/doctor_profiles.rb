FactoryGirl.define do
  factory :doctor_profile do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
  end

end
