require_relative '../uploader/image_uploader'
require 'carrierwave'
require 'carrierwave/orm/activerecord'
class Meme < ActiveRecord::Base
  belongs_to :user
  has_many :ratings, dependent: :destroy
  mount_uploader :image, ImageUploader

  validates :user_id, presence: true
  validates :name, presence: true
  validates :image, presence: true
end
