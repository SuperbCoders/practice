class AddVisitIdToNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :visit_id, :integer
  end
end
