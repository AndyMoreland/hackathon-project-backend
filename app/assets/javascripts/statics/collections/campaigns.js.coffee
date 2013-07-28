class CampaignsCollection extends Backbone.Collection
  model: CampaignModel
  url: "apps/1/campaigns"


window.CampaignsCollection = CampaignsCollection