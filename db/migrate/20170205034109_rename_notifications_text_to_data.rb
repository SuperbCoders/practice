class RenameNotificationsTextToData < ActiveRecord::Migration
  def change
    rename_column :notifications, :text, :data
  end
end
