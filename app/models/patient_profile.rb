class PatientProfile < BaseProfile

  # – вес
  field :weight, type: Float

  # – рост
  field :height, type: Float

  # – группа крови
  field :blood

  # – хронические заболевания
  field :diseases

  # – вредные привычки
  field :habits

  # – профессия
  field :profession

  # – комментрии
  field :comment

  # number– номер договора
  field :contract_id

  # – дата регистрации
  field :register_date, type: DateTime

  before_create :set_register_date

  private

  def set_register_date
    self.register_date = DateTime.now until self.register_date
  end
end
