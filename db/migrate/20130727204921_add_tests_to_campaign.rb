class AddTestsToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :test_a, :string
    add_column :campaigns, :test_b, :string
  end
end
