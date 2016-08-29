class WorkSchedule < ActiveRecord::Base
  # что-то связанное с приемами
  belongs_to :doctor

  validates_uniqueness_of :day, scope: :doctor
  validates_presence_of :start_at, :finish_at
end
