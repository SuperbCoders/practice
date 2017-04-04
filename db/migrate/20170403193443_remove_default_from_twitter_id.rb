class RemoveDefaultFromTwitterId < ActiveRecord::Migration
  def change
    change_column :doctors, :twitter_id, :string, default: '', null: false
  end
end
