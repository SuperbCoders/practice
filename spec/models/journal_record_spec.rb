require 'rails_helper'

RSpec.describe JournalRecord, type: :model do
  it { is_expected.to belong_to(:journal).of_type(Journal) }
  it { is_expected.to have_field(:tag) }
  it { is_expected.to have_field(:attachments).of_type(Array) }
end
