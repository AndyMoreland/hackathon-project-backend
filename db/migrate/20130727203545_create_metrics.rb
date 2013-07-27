class CreateMetrics < ActiveRecord::Migration
  def change
    create_table :metrics do |t|
      t.string :name
      t.references :campaign, index: true
      t.string :value

      t.timestamps
    end
  end
end
