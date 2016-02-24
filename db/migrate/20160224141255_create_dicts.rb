class CreateDicts < ActiveRecord::Migration
  def change
    create_table :dicts do |t|
      t.integer :dict_type
      t.text :dict_value
      t.integer :dictable_id
      t.string :dictable_type

      t.timestamps null: false
    end
  end
end
