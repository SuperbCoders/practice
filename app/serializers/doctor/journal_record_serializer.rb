class Doctor::JournalRecordSerializer < Doctor::BaseSerializer
  attributes :text, :journal_id

  has_many :attachments
end