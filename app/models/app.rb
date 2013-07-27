class App < ActiveRecord::Base
  belongs_to :company
  has_many :campaigns
end
