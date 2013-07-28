(function() {

  var StatsView = Backbone.View.extend({
    template: HandlebarsTemplates['stats'],
    className: "stats-page",

    initialize: function() {
      this.model = this.options.model;
    },

    postRender: function() {
      a = new MixpanelRequest(
        "http://mixpanel.com/api/2.0/events/",
        {
          event: ["campaign_impression"],
          type: "general",
          unit: "minute",
          interval: 1
        },
        function(data) {
          console.log(data)
        }
      );
    },

    render: function() {
      console.log("view");
      $(this.el).html(this.template(this.model.toJSON()));
      this.postRender()
      return this.el
    },

  });

  window.StatsView = StatsView

})();