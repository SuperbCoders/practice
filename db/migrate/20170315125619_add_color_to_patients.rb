class AddColorToPatients < ActiveRecord::Migration
  def change
    add_column :patients, :color, :string
  end
end
