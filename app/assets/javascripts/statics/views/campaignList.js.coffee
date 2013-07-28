class CampaignListView extends Backbone.View
  template: HandlebarsTemplates['campaignList']

  render: =>
    $(@el).html(@template())
    console.log("before")
    @cc.fetch( {
      success: () =>
        cv = new CollectionView({
          view: CampaignListView
          collection: @cc
          el: $("#campaigns tbody")
        })

        window.cv = cv;

        console.log("j=a'ijkasdf")
        cv.render()
      }
    )

    window.cc = @cc

    console.log("after")

    @el

  initialize: (options) =>
    @el = options.el
    @cc = new CampaignsCollection()

    # If the campaign collection changes, redner the list
  	# @model.on "change", @render, this
	  console.log "campaign list!"




window.CampaignListView = CampaignListView
