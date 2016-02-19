require 'rails_helper'

RSpec.describe Journal, type: :model do
  it { is_expected.to have_many(:journal_records) }
  it { is_expected.to belong_to(:doctor) }
  it { is_expected.to belong_to(:patient) }
  it { is_expected.to respond_to(:date) }
end
