class AddDeletedFieldToJournalRecordAttachment < ActiveRecord::Migration
  def change
    add_column :attachments, :is_deleted, :boolean, default: false
    remove_column :attachments, :deleted, :deleted_at
  end
end
