class AddConfirmableToDoctors < ActiveRecord::Migration
  def up
  	add_column :doctors, :confirmation_token, :string
    add_column :doctors, :confirmed_at, :datetime
    add_column :doctors, :confirmation_sent_at, :datetime
    add_column :doctors, :unconfirmed_email, :string # Only if using reconfirmable
    add_index :doctors, :confirmation_token, unique: true
    # User.reset_column_information # Need for some types of updates, but not for update_all.
    # To avoid a short time window between running the migration and updating all existing
    # users as confirmed, do the following
    execute("UPDATE doctors SET confirmed_at = NOW()")
  end

  def down
    remove_columns :doctors, :confirmation_token, :confirmed_at, :confirmation_sent_at, :unconfirmed_email
  end
end
