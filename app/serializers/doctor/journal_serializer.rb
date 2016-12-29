class Doctor::JournalSerializer < Doctor::BaseSerializer
  attributes :created_at, :updated_at, :journal_records, :attachments

  has_many :journal_records, serializer: Doctor::JournalRecordSerializer
  has_many :attachments, serializer: Doctor::AttachmentSerializer
  belongs_to :patient, serializer: Doctor::PatientSerializer
end