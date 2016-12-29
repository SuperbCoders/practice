class Journal < ActiveRecord::Base
  include Alertable
  belongs_to :patient
  belongs_to :doctor

  has_many :journal_records, dependent: :destroy
  has_many :attachments, as: :attachable, dependent: :destroy

  accepts_nested_attributes_for :journal_records, :attachments
end
