class ChangeListItemValueFieldType < ActiveRecord::Migration
  def self.down
    change_column :value_list_items, :value, :string
  end

  def self.up
    change_column :value_list_items, :value, :text
  end
end
