class Doctor::VisitSerializer < Doctor::BaseSerializer
  attributes :end, :duration, :start

  belongs_to :patient, serializer: Doctor::PatientSerializer
end