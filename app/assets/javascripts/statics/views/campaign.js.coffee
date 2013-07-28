class CampaignView extends Backbone.View
  template: HandlebarsTemplates['campaign']
  className: "campaign-page"

  events:
    "blur #split-test-input" : "updateSplitValue"
    "keydown #split-test-input": "downUpdateSplitValue"
    "keyup #split-test-input": "maybeUpdateSplitValue"
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

  downUpdateSplitValue: (event) ->
    if event.which == 13
      @updateSplitValue()
      return

    k = event.which
    if !((k >= 48 && k <= 57) || # numbers
        (k >= 96 && k <= 105) || # numpad
        (k == 37 || k == 39) || # right and left
        (k == 8 || k == 46)) # backspace and delete
      event.preventDefault()


  maybeUpdateSplitValue: (event) ->
    value = parseInt(event.target.value)
    if value >= 0 and value <= 100
      @updateSplitValue()


  updateSplitValue: =>
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
          @$("#save").removeClass("gray").text("Save Campaign")
        , 1000
      })


window.CampaignView = CampaignView
