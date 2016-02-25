class Visit < ActiveRecord::Base
  include Alertable
  
  enum visit_type: [:signed, :unsigned]

  belongs_to :doctor
  belongs_to :patient

  # validates_presence_of :visit_type
  validates_presence_of :doctor
  validates_presence_of :patient
  validates_presence_of :start_at
  validates_numericality_of :duration, greater_than: 0

  before_create :crossed_with_other_visits?

  def start
    start_at.iso8601
  end

  def end
    (start_at + duration.minutes).iso8601
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
