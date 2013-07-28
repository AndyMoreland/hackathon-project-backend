class CampaignListView extends Backbone.View
  template: HandlebarsTemplates['campaignList']
  className: "campaign-list-page"

  events:
    "keypress #campaign-name-box": "inputCampaignName"
    "keydown #campaign-name-box": "checkPlaceholder"
    "input #campaign-name-box": "checkPlaceholder"
    "blur #campaign-name-box": "blurPlaceholder"

    "mousedown #campaign-name-box": "clickCampaignName"


  initialize: (options) ->
    @cc = options.collection
    @$nameBox = $("#campaign-name-box")

    # If the campaign collection changes, redner the list
    # @model.on "change", @render, this
    console.log "campaign list!"

  render: =>
    $(@el).html(@template())

    cv = new CollectionView
      view: CampaignListItemView
      collection: @cc
      el: $(@el).find("#campaign-table tbody")
    cv.render()

    @el

  inputCampaignName: (event) ->
    @checkPlaceholder(event)

    if event.which == 13
      # fix empty lines
      event.preventDefault()
      @newCampaign(event.target.innerText)

  clickCampaignName: (event) ->
    event.target.innerText = "";
    $(event.target).removeClass("placeholder");

  checkPlaceholder: (event) ->
    if event.target.innerText != ""
      event.target.dataset.divPlaceholderContent = 'true';
    else
      @blurPlaceholder(event)

  blurPlaceholder: (event) ->
    event.target.innerText = ""
    delete(event.target.dataset.divPlaceholderContent)


  newCampaign: (name) ->
    model = new CampaignModel({
      published: false
      locked: false
      name: name
      });
    @cc.add(model);
    model.save();


window.CampaignListView = CampaignListView
