class CreateAttachments < ActiveRecord::Migration
  def change
    create_table :attachments do |t|
      t.text :file
      t.boolean :deleted, default: false
      t.datetime :deleted_at
      t.integer :attachable_id
      t.string  :attachable_type

      t.timestamps null: false
    end
  end
end
