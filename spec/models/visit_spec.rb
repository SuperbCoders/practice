require 'rails_helper'

RSpec.describe Visit, type: :model do
  let(:doctor) { FactoryGirl.create(:user) }
  let(:patient) { FactoryGirl.create(:user) }
  let(:visit) { FactoryGirl.build(:visit, doctor: doctor, patient: patient) }

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
    visit.patient = nil
    visit.signed!
    expect(visit).to_not be_valid
  end

  it 'is valid with patient if visit is unsigned' do
    visit.patient = patient
    visit.unsigned!
    expect(visit).to_not be_valid
  end

  it 'is valid with out patient if visit is unsigned' do
    visit.patient = nil
    visit.unsigned!
    expect(visit).not_to be_valid
  end

  it 'is invalid without unsigned_patient if visit is unsigned' do
    visit.unsigned!
    visit.unsigned_patient = nil
    expect(visit).not_to be_valid
  end

  pending 'it can be one patient per visit'

end
