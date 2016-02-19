require 'rails_helper'

RSpec.describe JournalRecord, type: :model do
  it { is_expected.to have_many(:attachments) }
  it { is_expected.to respond_to(:tag, :text) }
end
