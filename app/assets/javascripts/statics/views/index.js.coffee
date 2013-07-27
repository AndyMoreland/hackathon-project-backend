class IndexView extends Backbone.View
  template: HandlebarsTemplates['index']

  initialize: ->
        console.log "index!"

  render: ->
    $(@el).html(@template())


window.IndexView = IndexView
