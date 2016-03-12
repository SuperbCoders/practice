class AddDeletedFieldToJournalRecord < ActiveRecord::Migration
  def change
    add_column :journal_records, :is_deleted, :boolean, default: false
  end
end
