class AddCartColorToPatients < ActiveRecord::Migration
  def change
    add_column :patients, :cart_color, :string
  end
end
