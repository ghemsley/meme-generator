require './config/environment'
require_relative '../uploader/image_uploader'
class Meme < ActiveRecord::Base
  belongs_to :user
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy

  mount_uploader :image, ImageUploader
  mount_uploader :original_image, ImageUploader

  validates :user_id, presence: true
  validates :name, presence: true, uniqueness: true, length: { maximum: 100 }
  validates :image, presence: true
  validates :top_caption, presence: true, length: { maximum: 100 }
  validates :bottom_caption, presence: true, length: { maximum: 100 }
  validates :original_image, presence: true
end
