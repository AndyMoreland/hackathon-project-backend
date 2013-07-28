require 'zlib'

module SplitComputer
  def self.compute_class(campaign, device_id)
    if Zlib.crc32(device_id.to_s) % 100 <= campaign.split
      "test_a"
    else
      "test_b"
    end
  end
end
