class Dict < ActiveRecord::Base
  include Alertable
  enum dict_type: Practice::Static::DICT_TYPES

  belongs_to :dictable, polymorphic: true
  validates_uniqueness_of :dict_value, scope: :dictable_id
  validates_presence_of :dict_value
  scope :default, -> { where(dictable_id: nil) }
end
