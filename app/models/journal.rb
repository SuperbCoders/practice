class Journal < ActiveRecord::Base
  belongs_to :patient
  belongs_to :doctor

  has_many :journal_records, dependent: :destroy

end
