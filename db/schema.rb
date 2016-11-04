# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161104152642) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "appointments", force: :cascade do |t|
    t.integer  "patient_id"
    t.integer  "doctor_id"
    t.boolean  "archivated",    default: false
    t.boolean  "approved",      default: false
    t.datetime "approved_at"
    t.datetime "archivated_at"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  add_index "appointments", ["doctor_id"], name: "index_appointments_on_doctor_id", using: :btree
  add_index "appointments", ["patient_id"], name: "index_appointments_on_patient_id", using: :btree

  create_table "attachments", force: :cascade do |t|
    t.text     "file"
    t.datetime "deleted_at"
    t.integer  "attachable_id"
    t.string   "attachable_type"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.boolean  "is_deleted",      default: false
  end

  create_table "contacts", force: :cascade do |t|
    t.integer  "contact_type"
    t.integer  "data_type"
    t.string   "data"
    t.integer  "contactable_id"
    t.string   "contactable_type"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "contacts", ["contact_type"], name: "index_contacts_on_contact_type", using: :btree
  add_index "contacts", ["data_type"], name: "index_contacts_on_data_type", using: :btree

  create_table "dicts", force: :cascade do |t|
    t.integer  "dict_type"
    t.text     "dict_value"
    t.integer  "dictable_id"
    t.string   "dictable_type"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "doctors", force: :cascade do |t|
    t.string   "email",                  default: "",                     null: false
    t.string   "encrypted_password",     default: "",                     null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,                      null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.integer  "gender"
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "birthday"
    t.text     "avatar"
    t.text     "public_avatar"
    t.text     "specialty"
    t.text     "education"
    t.text     "experience"
    t.text     "about"
    t.integer  "office"
    t.integer  "profile"
    t.datetime "created_at",                                              null: false
    t.datetime "updated_at",                                              null: false
    t.string   "vk_id",                  default: "",                     null: false
    t.string   "fb_id",                  default: "",                     null: false
    t.string   "twitter_id",             default: "https://twitter.com/"
    t.integer  "before_schedule"
    t.integer  "stand_time"
    t.string   "username"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
  end

  add_index "doctors", ["confirmation_token"], name: "index_doctors_on_confirmation_token", unique: true, using: :btree
  add_index "doctors", ["email"], name: "index_doctors_on_email", unique: true, using: :btree
  add_index "doctors", ["reset_password_token"], name: "index_doctors_on_reset_password_token", unique: true, using: :btree

  create_table "identities", force: :cascade do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "avatar"
    t.string   "full_name"
    t.string   "email"
    t.string   "info"
    t.integer  "doctor_id"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "journal_records", force: :cascade do |t|
    t.integer  "journal_id"
    t.string   "tag"
    t.text     "text"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.text     "body"
    t.boolean  "is_deleted", default: false
  end

  add_index "journal_records", ["journal_id"], name: "index_journal_records_on_journal_id", using: :btree

  create_table "journals", force: :cascade do |t|
    t.integer  "patient_id"
    t.integer  "doctor_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "journals", ["doctor_id"], name: "index_journals_on_doctor_id", using: :btree
  add_index "journals", ["patient_id"], name: "index_journals_on_patient_id", using: :btree

  create_table "patients", force: :cascade do |t|
    t.string   "full_name"
    t.string   "email",         default: "",    null: false
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
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.text     "avatar"
    t.datetime "birthday"
    t.boolean  "rhesus"
    t.boolean  "in_archive",    default: false
    t.string   "cart_color"
    t.integer  "doctor_id"
    t.string   "password"
    t.string   "first_name"
  end

  create_table "settings", force: :cascade do |t|
    t.integer  "doctor_id"
    t.string   "calendar_view",             default: "day", null: false
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.string   "standart_shedule_interval"
  end

  create_table "value_list_items", force: :cascade do |t|
    t.string   "value",         null: false
    t.integer  "value_list_id", null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "value_lists", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "visits", force: :cascade do |t|
    t.datetime "start_at"
    t.integer  "duration"
    t.integer  "visit_type"
    t.text     "comment"
    t.integer  "doctor_id"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "created_by", default: "doctor"
    t.integer  "patient_id"
  end

  add_index "visits", ["doctor_id"], name: "index_visits_on_doctor_id", using: :btree

  create_table "work_schedules", force: :cascade do |t|
    t.integer  "doctor_id"
    t.integer  "day"
    t.string   "start_at"
    t.string   "finish_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "work_schedules", ["doctor_id"], name: "index_work_schedules_on_doctor_id", using: :btree

  add_foreign_key "appointments", "doctors"
  add_foreign_key "journal_records", "journals"
  add_foreign_key "journals", "doctors"
  add_foreign_key "visits", "doctors"
  add_foreign_key "work_schedules", "doctors"
end
