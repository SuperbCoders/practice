class AddInArchiveToPatients < ActiveRecord::Migration
  def change
    add_column :patients, :in_archive, :boolean, default: false
  end
end
