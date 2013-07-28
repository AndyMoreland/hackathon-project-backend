Workspace = Backbone.Router.extend({
  routes: {
    ""            :       "index",
    "campaigns"   :       "campaigns",  // #search/kiwis
    "campaign/:id" :      "campaign",  // #search/kiwis
  },

  initialize: function (options) {
    this.campaigns = new CampaignsCollection()
    this.campaigns.fetch();
  },

  index: function () {
    view = new IndexView()
    this.render(view);
  },

  campaigns: function () {
    view = new CampaignListView();
    this.render(view);
  },

  campaign: function (id) {
    view = new CampaignView();
    this.render(view);
  },

  render: function(view) {
    $("#content").html(view.render());
    if(view.added)
      view.added()
  }
});

$(document).ready(function () {
  window.mainRouter = new Workspace();

  Backbone.history.start();
});
