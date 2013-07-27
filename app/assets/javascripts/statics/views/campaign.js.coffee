class CampaignView extends Backbone.View
  template: HandlebarsTemplates['foo']

  initialize: (options) =>
    @el = options.el
    console.log("my el is", options.el)
    console.log "campaign!"

  render: =>
    console.log "FUCK OFF"
    window.a = @
    $(@el).html(@template())


window.CampaignView = CampaignView
