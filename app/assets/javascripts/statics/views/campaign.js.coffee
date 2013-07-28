class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']

  initialize: (options) ->
    @el = options.el
    console.log "campaign!"

  render: ->
    $(@el).html(@template())


window.CampaignView = CampaignView
