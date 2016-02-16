class JournalRecord < BaseModel

  field :attachments, type: Array
  field :date, type: DateTime
  field :tag

  belongs_to :journal
end
