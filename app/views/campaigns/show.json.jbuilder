json.id @campaign.id
json.app_id @campaign.app_id
json.name @campaign.name
json.created_at @campaign.created_at
json.updated_at @campaign.updated_at
json.split @campaign.split
json.test_a @campaign.test_a
json.test_b @campaign.test_b
json.published @campaign.published
json.locked @campaign.locked
json.active_test SplitComputer.compute_class(@campaign, params[:device_id]) if params[:device_id]
