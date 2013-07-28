class ChangeColumnsForCampaign < ActiveRecord::Migration
  def change
    change_column :campaigns, :test_a, :text
    change_column :campaigns, :test_b, :text
  end
end
