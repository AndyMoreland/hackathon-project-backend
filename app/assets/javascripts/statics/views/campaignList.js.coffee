class CampaignListView extends Backbone.View
  template: HandlebarsTemplates['campaignList']

  render: =>
    $(@el).html(@template())
    console.log("before")
    cv = new CollectionView({
      view: CampaignListView
      collection: @cc
      el: $("#campaigns tbody")
    })
    console.log("j=a'ijkasdf")
    cv.render()
    @el

  initialize: (options) =>
    @el = options.el
    @cc = new CampaignsCollection()

    # If the campaign collection changes, redner the list
  	# @model.on "change", @render, this
	  console.log "campaign list!"




window.CampaignListView = CampaignListView
