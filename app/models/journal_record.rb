class JournalRecord < ActiveRecord::Base
  belongs_to :journal

  has_many :attachments, as: :attachable, dependent: :destroy
  validates_presence_of :body, :tag
end
