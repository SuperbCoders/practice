
FactoryGirl.define do
  factory :visit do
    type :unsigned
    duration { rand(60..120) }
    date DateTime.now
  end
end
