class CampaignListView extends Backbone.View
  template: HandlebarsTemplates['campaignList']
  className: "campaign-list-page"

  initialize: (options) ->
    @cc = options.collection

    # If the campaign collection changes, redner the list
    # @model.on "change", @render, this
    console.log "campaign list!"

  render: =>
    $(@el).html(@template())
    cv = new CollectionView
      view: CampaignListItemView
      collection: @cc
      el: $("#campaigns tbody")

    cv.render()
    @el


window.CampaignListView = CampaignListView
