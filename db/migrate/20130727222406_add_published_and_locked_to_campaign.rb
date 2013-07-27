class AddPublishedAndLockedToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :published, :boolean
    add_column :campaigns, :locked, :boolean
  end
end
