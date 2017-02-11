class ChangeNotificationsUnreadedDefaultToTrue < ActiveRecord::Migration
  def change
    change_column :notifications, :unreaded, :boolean, default: true
  end
end
