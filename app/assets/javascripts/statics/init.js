Workspace = Backbone.Router.extend({
  routes: {
    "": "index",
    "search/:query":        "search",  // #search/kiwis
  },

  index: function () {
    view = new IndexView({el: $("#content")})
    view.render()
  },

  help: function () { },

  search: function (query) {
  }
});

window.mainRouter = new Workspace();

Backbone.history.start();
