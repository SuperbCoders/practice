class Doctor::VisitSerializer < Doctor::BaseSerializer
  attributes :end, :duration, :start, :created_by, :active

  belongs_to :patient, serializer: Doctor::PatientSerializer

  def active
    # Rails.logger.debug "visit active"
    # Rails.logger.debug "(#{object.start_at} <= #{Time.now + 5.minutes}) #{(object.start_at <= Time.now + 5.minutes).inspect}"
    # Rails.logger.debug "(#{object.start_at + object.duration.minute} > #{Time.now}) #{(object.start_at + object.duration.minute > Time.now).inspect}"
    if (object.start_at <= Time.now + 5.minutes) && (object.start_at + object.duration.minute > Time.now)
      # Rails.logger.debug "active"
      true
    else
      false
    end
  end
end
