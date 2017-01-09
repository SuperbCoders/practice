class Doctor::VisitSerializer < Doctor::BaseSerializer
  attributes :end, :duration, :start, :created_by

  belongs_to :patient, serializer: Doctor::PatientSerializer
end
