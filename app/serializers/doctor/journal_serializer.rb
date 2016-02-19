class Doctor::JournalSerializer < Doctor::BaseSerializer
  attributes :date

  belongs_to :patient, serializer: Doctor::PatientSerializer
end