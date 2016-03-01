class AddRhesusToPatient < ActiveRecord::Migration
  def change
    add_column :patients, :rhesus, :boolean
  end
end
