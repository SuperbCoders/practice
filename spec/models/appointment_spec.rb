require 'rails_helper'

RSpec.describe Appointment, type: :model do
  it { is_expected.to belong_to(:doctor) }
  it { is_expected.to belong_to(:patient) }
  it { is_expected.to respond_to(:approved, :approved_at, :archivated) }
end
