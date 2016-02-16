require 'rails_helper'

RSpec.describe Contact, type: :model do
  it { is_expected.to have_fields(:type, :data, :data_type) }
  it { is_expected.to belong_to(:base_profile) }
end
