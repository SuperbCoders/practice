class AddPublicPhoneToDoctors < ActiveRecord::Migration
  def change
    add_column :doctors, :public_phone, :string
  end
end
