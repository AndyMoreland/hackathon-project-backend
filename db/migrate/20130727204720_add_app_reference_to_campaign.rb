class AddAppReferenceToCampaign < ActiveRecord::Migration
  def change
    add_reference :campaigns, :app, index: true
  end
end
