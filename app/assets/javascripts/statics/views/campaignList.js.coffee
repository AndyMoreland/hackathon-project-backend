class CampaignListView extends Backbone.View
  template: HandlebarsTemplates['campaignList']

  initialize: (options) ->
    @el = options.el
    # If the campaign collection changes, redner the list
  	# @model.on "change", @render, this
	  console.log "campaign list!"

  render: ->
    $(@el).html(@template())
    @el


window.CampaignListView = CampaignListView
