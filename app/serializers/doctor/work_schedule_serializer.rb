class Doctor::WorkScheduleSerializer < Doctor::BaseSerializer
  attributes :day, :start_at, :finish_at

end