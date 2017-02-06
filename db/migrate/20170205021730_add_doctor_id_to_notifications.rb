class AddDoctorIdToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :doctor_id, :integer
  end
end
