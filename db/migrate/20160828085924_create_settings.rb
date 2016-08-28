class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.integer :doctor_id
      t.string :calendar_view, null: false, default: "day"

      t.timestamps null: false
    end
  end
end
