class AddStartAtToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :start_at, :datetime
  end
end
