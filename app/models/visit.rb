class Visit < BaseModel

  field :date, type: DateTime
  field :duration, type: Integer

  # signed - запись пациента который есть в системе
  # unsigned - просто запись в календаре
  as_enum :type, [:signed, :unsigned], map: :string, source: :type

  belongs_to :doctor, class_name: 'Doctor'
  belongs_to :patient, class_name: 'Patient'


  field :comment
  field :unsigned_patient, type: Hash

  validates_presence_of :type
  validates_presence_of :doctor
  validates_presence_of :patient, if: -> { signed? }
  validates_presence_of :unsigned_patient, if: -> {unsigned?}
  validates_presence_of :date
  validates_numericality_of :duration, greater_than: 0

  before_create :check_visit_uniqueness

  private

  def check_visit_uniqueness
    doctor.visits.where(:date.gte => date).map { |visit|
      visit_start = visit.date
      visit_end = visit.date + visit.duration.minute

      if visit_start < date && visit_end > date
        logger.info "Crossed visit"
        errors.add(:date, I18n.t('visit.errors.visit_can_not_be_crossed_with_another_visit'))
        return false
      else
        logger.info "Uncrossed visit #{visit_start.to_datetime} <> #{visit_end.to_datetime} : #{date.to_datetime}"
      end
    }
    true
  end
end
