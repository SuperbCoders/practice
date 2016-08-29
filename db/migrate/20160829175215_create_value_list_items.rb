class CreateValueListItems < ActiveRecord::Migration
  def change
    create_table :value_list_items do |t|
      t.string :value, null: false
      t.integer :value_list_id, null: false

      t.timestamps null: false
    end
  end
end
