class CampaignsController < ApplicationController
  before_filter :preload_app
  def index
    if params[:only_published]
      @campaigns = @app.campaigns.published
    else
      @campaigns = @app.campaigns
    end
  end

  def show
    @campaign = @app.campaigns.published.find(params[:id])
  end

  protected
  def preload_app
    @app = App.find(params[:app_id])
  end
end
