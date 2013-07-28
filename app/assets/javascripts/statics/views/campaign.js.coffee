class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']
  className: "campaign-page"

  events:
    "all #split-test-input" : "updateSplitTestBar"
    "click button[name=save]" : "save"

  initialize: =>
    @model = @options.model
    @editors = {}

  render: ->
    $(@el).html(@template(@model.toJSON()))

    @el

  initCodeEditor: (editorID) =>
    editor = ace.edit(editorID);
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/objectivec");
    @editors[editorID] = editor

  viewRendered: =>
    @initCodeEditor("codeA")
    @initCodeEditor("codeB")

  updateSplitTestBar: (e) =>

    percentA = e.target.value
    percentB = 98 - percentA;

    if percentA > 97
      percentA = 97
    if percentA < 2
      percentA = 2

    if percentB > 97
      percentB = 97
    if percentB < 2
      percentB = 2

    $("#split-test-bar-a").css("width", percentA + "%")
    $("#split-test-bar-b").css("width", percentB + "%")

  loadDataIntoModel: =>
    @model.set
      test_a: @editors["codeA"].getSession().getValue()
      test_b: @editors["codeB"].getSession().getValue()
      split: $(@el).find("#split-test-input").val()


  save: (e) =>
    console.log "Saving!"
    @loadDataIntoModel()
    @model.save()


window.CampaignView = CampaignView
