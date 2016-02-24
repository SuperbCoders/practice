class Dict < ActiveRecord::Base
  enum dict_type: Practice::Static::DICT_TYPES

  belongs_to :dictable, polymorphic: true

  scope :default, -> { where(dictable_id: nil) }
end
