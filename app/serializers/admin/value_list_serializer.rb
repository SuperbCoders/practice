class Admin::ValueListSerializer < ActiveModel::Serializer
  attributes :name
  has_many :value_list_items
end
