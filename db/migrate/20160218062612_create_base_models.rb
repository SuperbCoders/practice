class CreateBaseModels < ActiveRecord::Migration
  def change
    create_table :base_models do |t|

      t.timestamps null: false
    end
  end
end
