class ChangePatientsTable < ActiveRecord::Migration
  def change
    remove_column :visits, :patient_id  
  	execute "DROP TABLE patients CASCADE"
  	create_table(:patients) do |t|
      t.string   "full_name"
      t.string   "email",                  default: "", null: false
      t.integer  "gender"
      t.float    "weight"
      t.float    "height"
      t.string   "blood"
      t.text     "diseases"
      t.text     "habits"
      t.text     "profession"
      t.text     "comment"
      t.string   "contract_id"
      t.datetime "register_date"
      t.datetime "created_at",                          null: false
      t.datetime "updated_at",                          null: false
      t.text     "avatar"
      t.datetime "birthday"
      t.boolean  "rhesus"
    end
  end
end
