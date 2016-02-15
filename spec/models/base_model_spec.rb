require 'rails_helper'

RSpec.describe BaseModel, type: :model do
  let(:model) { BaseModel.new }

  it 'has messages attribute for notifications' do
    expect(model).respond_to?(:messages)
  end
end
