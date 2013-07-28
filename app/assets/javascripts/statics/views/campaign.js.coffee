class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']
  className: "campaign-page"

  events:
    "all #split-test-input" : "updateSplitTestBar"
    "click button[name=save]" : "save"

  initialize: =>
    @model = @options.model
    @editors = {}
    @model.on "change:split", @render, this

  foo: ->
    alert("bar")

  render: ->
    $(@el).html(@template(@model.toJSON()))
    @initCodeEditor("codeA")
    @initCodeEditor("codeB")
    @model.set(split:20)

    @el

  initCodeEditor: (editorID) =>
    editor = ace.edit($(@el).find("#" + editorID));
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/objectivec");
    @editors[editorID] = editor

  updateSplitTestBar: (e) =>

    console.log "updating bar"
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

  loadDataIntoModel: =>
    @model.set
      test_a: @editors["codeA"].getSession().getValue()
      test_b: @editors["codeB"].getSession().getValue()
      split: $(@el).find("#split-test-input").val()


  save: (e) =>
    console.log "Saving!"
    @loadDataIntoModel()
    @model.save(null, {
      success: () =>
        @$("#save").addClass("gray").text("Saved!")
        setTimeout () => 
          @$("#save").removeClass("gray").text("Save Camp")
        , 1000
      })


window.CampaignView = CampaignView
