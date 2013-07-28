Workspace = Backbone.Router.extend({
  routes: {
    ""            :       "index",
    "campaigns"   :       "campaigns",  // #search/kiwis
    "campaign/:id" :      "campaign",  // #search/kiwis
  },

  initialize: function (options) {
    this.campaigns = new CampaignsCollection()
    this.campaigns.fetch();
    console.log(this.campaigns);
  },

  index: function () {
    view = new IndexView({el: $("#content")})
    view.render()
  },

  campaigns: function () {
    view = new CampaignListView({el: $("#content")});
    view.render();
  },

  campaign: function (id) {
    view = new CampaignView({el: $("#content")});
    view.render();
  }
});

$(document).ready(function () {
  window.mainRouter = new Workspace();

  Backbone.history.start();
});
