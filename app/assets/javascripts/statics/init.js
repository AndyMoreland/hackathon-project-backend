Workspace = Backbone.Router.extend({
  routes: {
    "": "index",
    "help":                 "help",    // #help
    "search/:query":        "search",  // #search/kiwis
    "search/:query/p:page": "search"   // #search/kiwis/p7
  },

  help: function () { },                                   
  
  index: function () {
    view = new Foo({el: $("#content")})
    view.render()
  },

  search: function (query, page) {
  }
});

window.mainRouter = new Workspace();

Backbone.history.start();
