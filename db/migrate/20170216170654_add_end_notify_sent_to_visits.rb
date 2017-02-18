class AddEndNotifySentToVisits < ActiveRecord::Migration
  def change
    add_column :visits, :end_notify_sent, :boolean, default: false
  end
end
