require 'rails_helper'

RSpec.describe Dict, type: :model do
  it { is_expected.to respond_to(:dict_type, :dict_value) }
  it { is_expected.to belong_to(:dictable) }
end
