class Doctor::NotificationSerializer < Doctor::BaseSerializer
  attributes :created_at, :updated_at, :message, :data, :unreaded, :start_at, :notification_type

  belongs_to :doctor, serializer: Doctor::DoctorSerializer
  belongs_to :patient, serializer: Doctor::PatientSerializer
  belongs_to :visit, serializer: Doctor::VisitSerializer
end
