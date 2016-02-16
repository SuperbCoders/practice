class Journal < BaseModel
  belongs_to :patient, class_name: 'Patient'
  belongs_to :doctor, class_name: 'Doctor'

  has_many :journal_records
  field :date, type: DateTime
end
