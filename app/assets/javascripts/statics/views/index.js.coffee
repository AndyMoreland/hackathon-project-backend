class IndexView extends Backbone.View
  template: HandlebarsTemplates['index']
  className: "index-page"

  initialize: ->
        console.log "index!"

  render: ->
    $(@el).html(@template())

    @el


window.IndexView = IndexView
