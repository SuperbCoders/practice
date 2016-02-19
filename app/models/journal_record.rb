class JournalRecord < ActiveRecord::Base
  belongs_to :journal

  has_many :attachments, as: :attachable, dependent: :destroy

end
