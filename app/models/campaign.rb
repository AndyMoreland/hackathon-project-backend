class Campaign < ActiveRecord::Base
  belongs_to :app
  has_many :metrics
end
