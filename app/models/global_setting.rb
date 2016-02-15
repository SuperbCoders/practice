class GlobalSetting < BaseModel

  # [] – cреднее время приема пациента
  field :taking_hours, type: Array

  # [] – можно записаться на прием не позже, чем за X часов
  field :appointment_hours, type: Array
end
