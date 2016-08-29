class Contact < ActiveRecord::Base
  # Contact model
  enum contact_type: Practice::Static::CONTACT_TYPES
  enum data_type: Practice::Static::CONTACT_DATA_TYPES

  belongs_to :contactable, polymorphic: true

  validates_presence_of :contact_type, :data
end
