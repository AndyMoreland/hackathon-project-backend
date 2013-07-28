class CampaignsController < ApplicationController
  before_filter :preload_app
  def index
    if params[:only_published]
      @campaigns = @app.campaigns.published
    else
      @campaigns = @app.campaigns
    end

    # bullshit:

    @campaigns = [Campaign.new(name: "first campaign", id: 1, created_at: Time.now, test_a: "hi", test_b: "bye", published: true, locked: false),
                  Campaign.new(name: "second campaign", id: 2, created_at: Time.now, test_a: "hi", test_b: "bye", published: false, locked: false),
                  Campaign.new(name: "Locked Campaign", id: 3, created_at: Time.now, test_a: "code1", test_b: "code2", published: true, locked: true),
                  Campaign.new(name: "Unpublished Campaign", id: 4, created_at: Time.now, test_a: "test a", test_b: "test b", published: false, locked: false),
                ]
  end
  
  def update
    @campaign = Campaign.find(params[:id])
    @campaign.update_attributes(params[:campaign])
  end

  def create
    @campaign = Campaign.new(params[:campaign])
    @campaign.save
  end

  def show
    @campaign = @app.campaigns.published.find(params[:id])
  end

  protected
  def preload_app
    @app = App.find(params[:app_id])
  end
end
