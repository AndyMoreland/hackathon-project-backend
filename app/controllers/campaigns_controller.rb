class CampaignsController < ApplicationController
  before_filter :preload_app
  def index
    if params[:only_published]
      @campaigns = @app.campaigns.published
    else
      @campaigns = @app.campaigns
    end

    # bullshit:

    @campaigns = [Campaign.new(name: "first campaign", id: 1, created_at: Time.now, test_a: "hi", test_b: "bye"),
                  Campaign.new(name: "second campaign", id: 2, created_at: Time.now, test_a: "hi", test_b: "bye")]
  end

  def show
    @campaign = @app.campaigns.published.find(params[:id])
  end

  protected
  def preload_app
    @app = App.find(params[:app_id])
  end
end
