class AddSplitToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :split, :integer
  end
end
