class AddUnreadedToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :unreaded, :boolean, default: false
  end
end
