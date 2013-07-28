class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']
  className: "campaign-page"

  events:
    "change #split-test-input" : "updateSplitTestBar"
    "click button[name=save]" : "save"

  initialize: =>
    @model = @options.model

  render: ->
    $(@el).html(@template())

    @el

  initCodeEditor: (editorID) =>
    editor = ace.edit(editorID);
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/objectivec");

  viewRendered: =>
    @initCodeEditor("codeA")
    @initCodeEditor("codeB")

  updateSplitTestBar: (e) =>

    percentA = parseInt(e.target.value)
    percentB = 100 - percentA

    barA = $("#split-test-bar-a")
    barB = $("#split-test-bar-b")

    if percentA == 100
      barB.hide()
    if percentB == 100
      barA.hide()
    else
      barA.show()
      barB.show()

    $("#split-test-bar-a").css("width", percentA + "%")
    $("#split-test-bar-b").css("width", percentB + "%")

  save: (e) =>
    window.a = this
    console.log "Saving!"
    @model.save()


window.CampaignView = CampaignView
