class ChangeColuminInDoctors < ActiveRecord::Migration
  def change
  	change_column :doctors, :vk_id, :string, default: "", null: false
  	change_column :doctors, :fb_id, :string, default: "", null: false
  	Doctor.update_all("fb_id = '', vk_id = ''")
  end
end
