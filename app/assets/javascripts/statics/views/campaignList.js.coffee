class CampaignListView extends Backbone.View
  template: HandlebarsTemplates['campaignList']

  initialize: (options) ->
    @el = options.el
    @cc = new CampaignsCollection()

    # If the campaign collection changes, redner the list
    # @model.on "change", @render, this
    console.log "campaign list!"

  render: =>
    $(@el).html(@template())
    @cc.fetch( {
      success: () =>
        cv = new CollectionView({
          view: CampaignListItemView
          collection: @cc
          el: $("#campaigns tbody")
        })
        cv.render()
      }
    )

    @el


window.CampaignListView = CampaignListView
