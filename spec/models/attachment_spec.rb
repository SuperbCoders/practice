require 'rails_helper'

RSpec.describe Attachment, type: :model do
  it { is_expected.to respond_to(:file, :deleted_at, :deleted) }
  it { is_expected.to belong_to(:attachable) }
end
