class CampaignListView extends Backbone.View
  template: HandlebarsTemplates['campaignList']

  initialize: (options) ->
    @el = options.el
    console.log "campaign list!"

  render: ->
    $(@el).html(@template())


window.CampaignListView = CampaignListView
