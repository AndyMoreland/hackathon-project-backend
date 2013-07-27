class AddSplitToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :split, :number
  end
end
