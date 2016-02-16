
FactoryGirl.define do
  factory :doctor do
    email { Faker::Internet.safe_email }
    password { SecureRandom.hex }
  end
end
