class CompaniesController < ApplicationController
  before_filter :preload_company
  
  def index
    render :text => "Companies controller"
  end

  protected
  def preload_company
    render :text => "OMG GIVE ME A COMPANY ID" if params[:company_id].nil?
    @company = Company.find_by_id(params[:company_id])
  end
end
