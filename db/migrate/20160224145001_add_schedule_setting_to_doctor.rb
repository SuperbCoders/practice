class AddScheduleSettingToDoctor < ActiveRecord::Migration
  def change
    add_column :doctors, :before_schedule, :integer
    add_column :doctors, :stand_time, :integer
  end
end
