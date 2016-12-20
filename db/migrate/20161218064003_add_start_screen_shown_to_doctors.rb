class AddStartScreenShownToDoctors < ActiveRecord::Migration
  def change
    add_column :doctors, :start_screen_shown, :boolean, null: false, default: false
  end
end
