class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']
  className: "campaign-page"

  events:
    "blur #split-test-input" : "updateSplitValue"
    "click button[name=save]" : "save"

  initialize: =>
    @model = @options.model
    @editors = {}
    @model.on "change:split", @renderSplitTestBar

  foo: ->
    alert("bar")

  render: =>
    $(@el).html(@template(@model.toJSON()))
    @initCodeEditor("codeA")
    @initCodeEditor("codeB")
    @renderSplitTestBar()
    @delegateEvents()

    @el

  initCodeEditor: (editorID) =>
    editor = ace.edit($(@el).find("#" + editorID)[0]);
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/objectivec");
    @editors[editorID] = editor

  renderSplitTestBar: =>
    percentA = parseInt(@model.get("split"), 10)
    percentB = 100 - percentA

    barA = $(@el).find("#split-test-bar-a")
    barB = $(@el).find("#split-test-bar-b")

    if percentA == 100
      barB.hide()
    if percentB == 100
      barA.hide()
    else
      barA.show()
      barB.show()

    $(@el).find("#split-test-bar-a").css("width", percentA + "%")
    $(@el).find("#split-test-bar-b").css("width", percentB + "%")

  updateSplitValue: =>
    console.log "yo, updating value"
    @model.set split: $(@el).find("#split-test-input").val()

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
