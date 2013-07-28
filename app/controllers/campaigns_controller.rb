class CampaignsController < ApplicationController
  before_filter :preload_app
  def index
    if params[:only_published]
      @campaigns = @app.campaigns.published
    else
      @campaigns = @app.campaigns
    end
  end
  
  def update
    @campaign = Campaign.find(params[:id])
    @campaign.update_attributes(params[:campaign].permit!)
    
    render :json => { status: :ok } 
  end

  def create
    @campaign = Campaign.new(params[:campaign])
    @campaign.save
    
    render :json => { status: :ok } 
  end

  def show
    @campaign = @app.campaigns.published.find(params[:id])
  end

  protected
  def preload_app
    @app = App.find(params[:app_id])
  end
end
