class Attachment < ActiveRecord::Base
  include Attachable
  include SoftDeletable

  belongs_to :attachable, polymorphic: true
end
