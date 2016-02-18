require 'rails_helper'

RSpec.describe Doctor, type: :model do
  it { is_expected.to respond_to(:gender, :office, :profile) }
  it { is_expected.to respond_to(:avatar, :public_avatar) }
  it { is_expected.to have_many(:contacts) }
  it { is_expected.to have_many(:visits).dependent(:destroy) }
  it { is_expected.to have_many(:appointments) }
  it { is_expected.to have_many(:patients).through(:appointments) }
end
