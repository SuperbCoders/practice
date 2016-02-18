class AddAvatarFieldToPatient < ActiveRecord::Migration
  def change
    add_column :patients, :avatar, :text
  end
end
