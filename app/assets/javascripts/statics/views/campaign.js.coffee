class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']
  className: "campaign-page"

  events:
    "change #split-test-input" : "updateSplitTestBar"

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
    # if percentA > 97
    #   percentA = 97
    # if percentA < 2
    #   percentA = 2

    # if percentB > 97
    #   percentB = 97
    # if percentB < 2
    #   percentB = 2
      
    $("#split-test-bar-a").css("width", percentA + "%")
    $("#split-test-bar-b").css("width", percentB + "%")


window.CampaignView = CampaignView
