class AddFirstNameToPatients < ActiveRecord::Migration
  def change
    add_column :patients, :first_name, :string
  end
end
