class AddSoonNotifySentToVisits < ActiveRecord::Migration
  def change
    add_column :visits, :soon_notify_sent, :boolean, default: false
  end
end
