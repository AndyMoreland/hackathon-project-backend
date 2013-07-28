class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']
  className: "campaign-page"

  events:
    "all #split-test-input" : "updateSplitTestBar"

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


window.CampaignView = CampaignView
