require 'rails_helper'

RSpec.describe Visit, type: :model do
  let(:doctor) { FactoryGirl.create(:doctor) }
  let(:patient) { FactoryGirl.create(:patient) }

  it { is_expected.to have_field(:date).of_type(DateTime) }
  it { is_expected.to have_field(:duration).of_type(Integer) }
  it { is_expected.to have_field(:type) }
  it { is_expected.to have_field(:comment) }
  it { is_expected.to have_field(:unsigned_patient) }
  it { is_expected.to validate_numericality_of(:duration).greater_than(0) }

  it { is_expected.to belong_to(:doctor).of_type(Doctor) }
  it { is_expected.to belong_to(:patient).of_type(Patient)}
  it { is_expected.to validate_presence_of(:doctor) }
  it { is_expected.to validate_presence_of(:date) }

  it 'is invalid without patinet if visit is signed' do
    visit = FactoryGirl.build(:visit,doctor: doctor,
        type: :signed,
        date: DateTime.now,
        duration: 60)

    expect(visit).to_not be_valid
  end

  it 'is invalid without unsigned_patient if visit is unsigned' do
    visit = FactoryGirl.build(:visit,doctor: doctor,
        type: :unsigned,
        date: DateTime.now,
        duration: 60)

    expect(visit).not_to be_valid
  end

  it 'can not be crossed with another visit' do
    visit = FactoryGirl.create(:visit,doctor: doctor,
        type: :unsigned,
        unsigned_patient: {name: Faker::Name.name},
        date: DateTime.now,
        duration: 60)

    second_visit = FactoryGirl.build(:visit,
        doctor: doctor,
        patient: patient,
        type: :signed,
        date: (DateTime.now + 20.minute),
        duration: 60
    )

    expect(visit).to be_valid
    expect(second_visit.save).not_to be_truthy

  end

end
