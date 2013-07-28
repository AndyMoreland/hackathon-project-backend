class CampaignModel extends Backbone.Model
  defaults:
    id: null
    published: null
    locked: null
    name: ""
    app_id: 1


window.CampaignModel = CampaignModel