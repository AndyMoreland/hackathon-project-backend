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

ActiveRecord::Schema.define(version: 20130727204921) do

  create_table "apps", force: true do |t|
    t.string   "name"
    t.integer  "company_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "apps", ["company_id"], name: "index_apps_on_company_id"

  create_table "campaigns", force: true do |t|
    t.integer  "company_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "split"
    t.integer  "app_id"
    t.string   "test_a"
    t.string   "test_b"
  end

  add_index "campaigns", ["app_id"], name: "index_campaigns_on_app_id"
  add_index "campaigns", ["company_id"], name: "index_campaigns_on_company_id"

  create_table "companies", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "metrics", force: true do |t|
    t.string   "name"
    t.integer  "campaign_id"
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "metrics", ["campaign_id"], name: "index_metrics_on_campaign_id"

end
