require 'rails_helper'

RSpec.describe Contact, type: :model do
  it { is_expected.to respond_to(:contact_type, :data_type) }
  it { is_expected.to belong_to(:contactable) }
  it { is_expected.to validate_presence_of(:contact_type) }
  it { is_expected.to validate_presence_of(:data) }
end
