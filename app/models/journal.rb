class Journal < ActiveRecord::Base
  belongs_to :patient
  belongs_to :doctor

  has_many :journal_records, dependent: :destroy

  def date
    created_at.iso8601
  end
end
