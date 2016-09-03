class AddCreatedByToVisits < ActiveRecord::Migration
  def change
    add_column :visits, :created_by, :string, default: "doctor"
  end
end
