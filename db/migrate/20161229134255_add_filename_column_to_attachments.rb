class AddFilenameColumnToAttachments < ActiveRecord::Migration
  def change
    add_column :attachments, :filename, :string
  end
end
