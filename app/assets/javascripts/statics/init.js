Workspace = Backbone.Router.extend({
  routes: {
    "": "index",
    "campaigns":        "campaigns",  // #search/kiwis
    "campaign:id":       "campaign",  // #search/kiwis
  },

  index: function () {
    view = new IndexView({el: $("#content")})
    view.render()
  },

  campaigns: function () { },

  campaign: function (id) {
  
  }

});

window.mainRouter = new Workspace();

Backbone.history.start();
