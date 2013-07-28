class Campaign < ActiveRecord::Base
  belongs_to :app
  has_many :metrics

  scope :published, -> { where(:published => true) }
  after_initialize :init

  def init
    self.company_id ||= 1
    self.split  ||= 100
    self.app_id ||= 1
    self.test_a ||= "Control"
    self.test_b ||= "Test"
    self.published ||= false
    self.locked ||= false
  end
end
