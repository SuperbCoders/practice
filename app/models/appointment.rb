class Appointment < ActiveRecord::Base
  belongs_to :patient
  belongs_to :doctor

  validates_uniqueness_of :patient_id, scope: :doctor_id
end
