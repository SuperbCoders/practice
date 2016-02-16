require 'rails_helper'

RSpec.describe Journal, type: :model do
  it { is_expected.to have_field(:date).of_type(DateTime) }
  it { is_expected.to belong_to(:patient).of_type(Patient) }
  it { is_expected.to belong_to(:doctor).of_type(Doctor) }
  it { is_expected.to have_many(:journal_records) }
end
