class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.references :patient, index: true, foreign_key: true
      t.references :doctor, index: true, foreign_key: true
      t.boolean :archivated, default: false
      t.boolean :approved, default: false
      t.datetime :approved_at, default: nil
      t.datetime :archivated_at, default: nil
      t.timestamps null: false
    end
  end
end
