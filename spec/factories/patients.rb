
FactoryGirl.define do
  factory :patient_1, class: Patient do
    id 1
    doctor_id 1
    full_name 'test patient name'
  end
end
