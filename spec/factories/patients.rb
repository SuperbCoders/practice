
FactoryGirl.define do
  factory :patient do
    email { Faker::Internet.safe_email }
    password { SecureRandom.hex }
  end
end
