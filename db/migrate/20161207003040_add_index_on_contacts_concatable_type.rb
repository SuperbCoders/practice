class AddIndexOnContactsConcatableType < ActiveRecord::Migration
  def change
    add_index :contacts, :contactable_type
  end
end
