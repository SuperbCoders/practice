class ScheduleSetting < BaseModel

  as_enum :day, [:monday, :tuesday, :wendesday, :thursday, :friday, :saturday, :sunday],
      map: :string, source: :day

  field :start, type: String
  field :end, type: String

  belongs_to :doctor_profile
  validates_uniqueness_of :day, scope: :doctor_profile
end
