require 'rails_helper'

RSpec.describe Patient, type: :model do
  it { is_expected.to respond_to(:avatar, :gender) }
  it { is_expected.to have_many(:contacts) }
  it { is_expected.to have_many(:visits).dependent(:destroy) }
  it { is_expected.to have_many(:appointments) }
end
