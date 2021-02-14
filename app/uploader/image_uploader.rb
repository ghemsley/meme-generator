
require 'carrierwave'
require 'carrierwave/orm/activerecord'

class ImageUploader < CarrierWave::Uploader::Base
  storage :fog
end
