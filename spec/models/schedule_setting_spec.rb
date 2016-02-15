require 'rails_helper'

RSpec.describe ScheduleSetting, type: :model do

  it 'has fields day, start, end' do
    is_expected.to have_fields(:day, :start, :end)
  end

  it { is_expected.to validate_uniqueness_of(:day).scoped_to(:doctor_profile) }

  it { is_expected.to belong_to(:doctor_profile) }

end
