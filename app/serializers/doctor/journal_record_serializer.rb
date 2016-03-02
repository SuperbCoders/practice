class Doctor::JournalRecordSerializer < Doctor::BaseSerializer
  attributes :body, :journal_id, :tag, :created_at, :updated_at

  has_many :attachments
end