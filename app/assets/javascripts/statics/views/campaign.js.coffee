class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']
  className: "campaign-page"

  initialize: (options) ->
    @el = options.el

  render: ->
    $(@el).html(@template())
    @el


window.CampaignView = CampaignView
