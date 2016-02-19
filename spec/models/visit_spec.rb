require 'rails_helper'

RSpec.describe Visit, type: :model do
  it { is_expected.to respond_to(:visit_type) }
  it { is_expected.to respond_to(:start) }
  it { is_expected.to respond_to(:start_at) }
  it { is_expected.to respond_to(:end) }
  it { is_expected.to belong_to(:doctor) }
  it { is_expected.to belong_to(:patient) }
  it { is_expected.to validate_presence_of(:visit_type) }
  it { is_expected.to validate_presence_of(:doctor) }
  it { is_expected.to validate_presence_of(:patient) }
  it { is_expected.to validate_presence_of(:start_at) }
end
