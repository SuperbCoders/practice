class CreateJournalRecords < ActiveRecord::Migration
  def change
    create_table :journal_records do |t|
      t.references :journal, index: true, foreign_key: true
      t.string :tag
      t.text :text

      t.timestamps null: false
    end
  end
end
