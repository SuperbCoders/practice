class Journal < ActiveRecord::Base
  include Alertable
  belongs_to :patient
  belongs_to :doctor

  has_many :journal_records, dependent: :destroy

end
