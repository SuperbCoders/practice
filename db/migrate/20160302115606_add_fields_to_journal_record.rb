class AddFieldsToJournalRecord < ActiveRecord::Migration
  def change
    add_column :journal_records, :body, :text
  end
end
