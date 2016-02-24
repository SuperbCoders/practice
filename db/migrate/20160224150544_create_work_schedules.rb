class CreateWorkSchedules < ActiveRecord::Migration
  def change
    create_table :work_schedules do |t|
      t.references :doctor, index: true, foreign_key: true
      t.integer :day
      t.string :start_at
      t.string :finish_at

      t.timestamps null: false
    end
  end
end
