class AddBirthdayToPatient < ActiveRecord::Migration
  def change
    add_column :patients, :birthday, :datetime
  end
end
