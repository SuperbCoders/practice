require 'rails_helper'

RSpec.describe WorkSchedule, type: :model do
  it { is_expected.to respond_to(:day, :start_at, :finish_at) }
  it { is_expected.to belong_to(:doctor) }
  it { is_expected.to validate_presence_of(:start_at) }
  it { is_expected.to validate_presence_of(:finish_at) }
end
