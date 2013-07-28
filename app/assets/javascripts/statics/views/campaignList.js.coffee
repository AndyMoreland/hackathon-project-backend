class CampaignListView extends Backbone.View
  template: HandlebarsTemplates['campaignList']
  className: "campaign-list-page"

  initialize: (options) ->
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
          el: $("#campaign-table tbody")
        })
        cv.render()
      }
    )
    @el


window.CampaignListView = CampaignListView
