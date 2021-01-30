require_relative '../uploader/image_uploader'
require 'carrierwave'
require 'carrierwave/orm/activerecord'
class Meme < ActiveRecord::Base
  belongs_to :user
  has_many :ratings, dependent: :destroy
  has_many :comments, dependent: :destroy

  mount_uploader :image, ImageUploader
  mount_uploader :original_image, ImageUploader

  validates :user_id, presence: true
  validates :name, presence: true
  validates :image, presence: true
  validates :top_caption, presence: true
  validates :bottom_caption, presence: true
  validates :original_image, presence: true
end
