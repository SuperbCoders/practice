class Contact < ActiveRecord::Base
  enum contact_type: [:phone, :social, :email]
  enum data_type: [:mobile, :work, :home, :vk, :fb, :twitter]

  belongs_to :contactable, polymorphic: true

  validates_presence_of :contact_type, :data
end
