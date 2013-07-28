class CampaignListItemView extends Backbone.View
  template: HandlebarsTemplates['campaignListItem']
  tagName: "tr"
  className: "campaign"

  initialize: (options) ->
    console.log "campaign list!"

  render: ->
    $(@el).html(@template(@model.toJSON()))
    @el


window.CampaignListItemView = CampaignListItemView
