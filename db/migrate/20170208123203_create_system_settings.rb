class CreateSystemSettings < ActiveRecord::Migration
  def change
    create_table :system_settings do |t|
      t.string :name, null: false
      t.string :slug, default: ''
      t.text :value, default: ''

      t.timestamps null: false
    end
  end
end
