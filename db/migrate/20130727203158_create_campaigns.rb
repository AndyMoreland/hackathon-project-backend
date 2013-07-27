class CreateCampaigns < ActiveRecord::Migration
  def change
    create_table :campaigns do |t|
      t.references :company, index: true
      t.string :name

      t.timestamps
    end
  end
end
