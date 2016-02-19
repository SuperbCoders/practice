class Attachment < ActiveRecord::Base
  include Attachable

  belongs_to :attachable, polymorphic: true
end
