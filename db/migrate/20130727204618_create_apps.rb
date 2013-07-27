class CreateApps < ActiveRecord::Migration
  def change
    create_table :apps do |t|
      t.string :name
      t.references :company, index: true

      t.timestamps
    end
  end
end
