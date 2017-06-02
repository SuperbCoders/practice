
FactoryGirl.define do
  factory :visit_1, class: Visit do
    id 1
    doctor_id 1
    start_at { Time.now + 1.hour }
    duration 30
  end

  factory :visit_2, class: Visit do
    id 1
    doctor_id 1
    start_at { Time.now + 2.hour }
    duration 30
  end
end
