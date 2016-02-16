require 'rails_helper'

RSpec.describe PatientProfile, type: :model do
  let(:patient) { PatientProfile.create(first_name: 'Timur', last_name: 'Talipov') }
  it { is_expected.to have_many(:contacts) }
  it { is_expected.to have_fields(:weight, :height).of_type(Float) }
  it { is_expected.to have_fields(:blood, :diseases, :habits, :profession, :comment, :contract_id) }
  it { is_expected.to belong_to(:patient).of_type(Patient) }
end
