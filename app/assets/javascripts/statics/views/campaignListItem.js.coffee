class CampaignListItemView extends Backbone.View
  template: HandlebarsTemplates['campaignListItem']

  initialize: (options) ->
    console.log "campaign list!"

  render: ->
    $(@el).html(@template())
    @el


window.CampaignListItemView = CampaignListItemView
