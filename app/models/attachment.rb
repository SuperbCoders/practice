class Attachment < ActiveRecord::Base
	# For attachemt in models
  include Attachable
  include SoftDeletable

  belongs_to :attachable, polymorphic: true
end
