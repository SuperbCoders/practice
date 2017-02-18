class Doctor::VisitSerializer < Doctor::BaseSerializer
  attributes :end, :duration, :start, :created_by, :active

  belongs_to :patient, serializer: Doctor::PatientSerializer

  def active
    if (object.start_at <= Time.now + 5.minutes) && (object.start_at + object.duration.minute > Time.now)
      true
    else
      false
    end
  end
end
