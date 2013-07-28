class CollectionView extends Backbone.View
  initialize: =>
    @rowView = @options.view
    @collection = @options.collection
    @el = @options.el

    console.error "CollectionView: Expected view" unless @options.view
    console.error "CollectionView: Expected collection" unless @options.collection
    console.error "CollectionView: Expected element" unless @options.el

    @collection.on "add", @addItem
    @collection.on "reset", @render
    @views = {}

  addItem: (model) =>
    rowViewEl =
    view = new @rowView(model: model)
    $(@el).append(view.render())
    @views[model] = view

  render: =>
    console.info "Re-rendering", @
    $(@el).empty()
    @collection.each (model) =>
      @addItem(model)


window.CollectionView = CollectionView
