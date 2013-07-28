class CampaignListItemView extends Backbone.View
  template: HandlebarsTemplates['campaignListItem']
  tagName: "tr"
  className: "campaign-list-item"

  events:
    'click #btn-remove': 'removeItem'
    'click .lock-btn': 'lockClick'

  initialize: (options) ->
    console.log "campaign list item!"
    @model.on("change:locked", @modelChanged, this)

  render: ->
    $(@el).html(@template(@model.toJSON()))
    @el

  removeItem: (event) ->
    @model.destroy()

  lockClick: (event) ->
    @model.set("locked", !@model.get("locked"))

  modelChanged: (event) ->
    @render()
    @model.save()


window.CampaignListItemView = CampaignListItemView
