class AddPatientIdToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :patient_id, :integer
  end
end
