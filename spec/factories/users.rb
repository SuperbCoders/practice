
FactoryGirl.define do
  factory :user do
    email { Faker::Internet.safe_email }
    password { SecureRandom.hex }
  end
end
