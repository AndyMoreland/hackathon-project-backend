class CampaignModel extends Backbone.Model
  defaults:
    id: null
    published: null
    locked: null
    name: ""
    app_id: 1
    split: 100


window.CampaignModel = CampaignModel