class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.integer :contact_type
      t.integer :data_type
      t.string :data
      t.integer :contactable_id
      t.string  :contactable_type

      t.timestamps null: false
    end
    add_index :contacts, :contact_type
    add_index :contacts, :data_type
  end
end
