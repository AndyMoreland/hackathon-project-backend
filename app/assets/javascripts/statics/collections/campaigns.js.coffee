class CampaignsCollection extends Backbone.Collection
  model: CampaignModel
  url: "apps/1/campaigns"

  initialize: ->
    @on( "destroy", @modelDestroyed, this)

  modelDestroyed: (model) ->
    console.log(model)
    @remove(model)


window.CampaignsCollection = CampaignsCollection