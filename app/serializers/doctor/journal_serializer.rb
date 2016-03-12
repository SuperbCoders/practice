class Doctor::JournalSerializer < Doctor::BaseSerializer
  attributes :created_at, :updated_at, :journal_records

  has_many :journal_records, serializer: Doctor::JournalRecordSerializer
  belongs_to :patient, serializer: Doctor::PatientSerializer
end