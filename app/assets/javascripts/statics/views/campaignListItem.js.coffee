class CampaignListItemView extends Backbone.View
  template: HandlebarsTemplates['campaignListItem']
  tagName: "tr"
  className: "campaign-list-item"

  events:
    'click #btn-remove': 'removeItem'

  initialize: (options) ->
    console.log "campaign list item!"

  render: ->
    $(@el).html(@template(@model.toJSON()))
    @el

  removeItem: (event) ->
    @model.destroy()


window.CampaignListItemView = CampaignListItemView
