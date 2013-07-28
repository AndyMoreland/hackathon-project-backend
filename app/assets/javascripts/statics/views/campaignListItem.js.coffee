class CampaignListItemView extends Backbone.View
  template: HandlebarsTemplates['campaignListItem']
  tagName: "tr"
  className: "campaign-list-item"

  events:
    'click #btn-remove': 'removeItem'
    'click .lock-btn': 'lockClick'
    'click .publish-btn': 'publishClick'
    'click .edit-btn': 'editClick'

  initialize: (options) ->
    console.log "campaign list item!"
    @model.on("change:locked", @lockChanged, this)
    @model.on("change:published", @modelChanged, this)
    @model.on("change:id", @modelChanged, this)

  render: ->
    $(@el).html(@template(@model.toJSON()))
    @el

  removeItem: (event) ->
    @model.destroy()

  lockClick: (event) ->
    @model.set("locked", !@model.get("locked"))

  publishClick: (event) ->
    if @model.get("locked")
      event.preventDefault()
      event.stopPropagation()
      return;

    @model.set("published", !@model.get("published"))

  lockChanged: (event) ->
    @modelChanged(event)

  editClick: (event) ->
    if @model.get("locked")
      event.preventDefault()
      event.stopPropagation()
      return;

  modelChanged: (event) ->
    @render()
    @model.save()


window.CampaignListItemView = CampaignListItemView
