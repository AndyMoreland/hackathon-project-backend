Workspace = Backbone.Router.extend({
  routes: {
    ""            :       "campaigns",
    "campaigns"   :       "campaigns",  // #search/kiwis
    "campaign/:id" :      "campaign",  // #search/kiwis
  },

  initialize: function (doneCallback) {
    this.campaigns = new CampaignsCollection();
    this.campaigns.fetch( { success: doneCallback } );
  },

  index: function () {
    view = new IndexView()
    this.render(view);
  },

  campaigns: function () {
    view = new CampaignListView({collection: this.campaigns});
    this.render(view);
  },

  campaign: function (id) {
    view = new CampaignView({ model: this.campaigns.get(parseInt(id, 10)) });
    this.render(view);
  },

  render: function(view) {
    $("#content").html(view.render());
    if(view.viewRendered)
      view.viewRendered()
  }
});

$(document).ready(function () {
    window.mainRouter = new Workspace(function () {
        Backbone.history.start();
    });
});
