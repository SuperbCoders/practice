class Visit < ActiveRecord::Base
  # пока не разбирался что это.
  include Alertable

  enum visit_type: [:signed, :unsigned]

  # default_scope -> {order(start_at: :desc)}
  scope :actual, -> {where("start_at > ?", Time.now.to_date)}
  scope :signeds, -> {where(visit_type: 0)} #todo: поменять на signed/unsigned
  scope :unsigneds, -> {where(visit_type: 1)}

  belongs_to :doctor
  belongs_to :patient

  # validates_presence_of :visit_type
  validates_presence_of :doctor
  validates_presence_of :patient
  validates_presence_of :start_at
  validates_numericality_of :duration, greater_than: 0

  # before_create :crossed_with_other_visits?

  def start
    start_at.iso8601
  end

  def end
    (start_at + duration.minutes).iso8601
  end

def send_soon_notify!
  doctor_id = self.doctor_id
  patient_id = self.patient_id
  start_at = self.start_at
  # "message" is needed for popup otherwise it will be failed
  # Notification.create doctor_id: doctor_id, patient_id: patient_id, start_at: start_at, visit: self, notification_type: 'visit_soon', message: 'Скоро начнется новый прием'
  patient = Patient.find patient_id
  Notification.create doctor_id: doctor_id, patient_id: patient_id, start_at: start_at, visit: self, notification_type: 'visit_soon', message: "Через 5 минут у вас записан #{patient.full_name}"
  self.update_attribute :soon_notify_sent, true
end

def send_end_notify!
  doctor_id = self.doctor_id
  patient_id = self.patient_id
  start_at = self.start_at
  # "message" is needed for popup otherwise it will be failed
  Notification.create doctor_id: doctor_id, patient_id: patient_id, start_at: start_at, visit: self, notification_type: 'visit_end'
  self.update_attribute :end_notify_sent, true
end

  private

  def crossed_with_other_visits?
    doctor.visits.all.map { |visit|
      logger.info "Visit start_at #{visit.start}. End at #{visit.end} <=> #{start_at}"
      visit_start = visit.start_at
      visit_end = visit.start_at + visit.duration.minute


      if visit_start <= start_at && visit_end >= start_at
        errors.add(:start_at, I18n.t('visit.errors.visit_can_not_be_crossed_with_another_visit'))
        return false
      else
        logger.info "#{visit_start} <= #{start_at} : #{visit_start < start_at}"
        logger.info "#{visit_end} >= #{start_at} : #{visit_end < start_at}"
        logger.info "Uncrossed visit #{visit_start.to_datetime} <> #{visit_end.to_datetime} : #{start_at.to_datetime}"
      end
    }
  end

end
