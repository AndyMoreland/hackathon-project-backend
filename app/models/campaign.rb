class Campaign < ActiveRecord::Base
  belongs_to :app
  has_many :metrics

  scope :published, -> { where(:published => true) }
end
