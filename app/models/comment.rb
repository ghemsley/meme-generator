require './config/environment'
class Comment < ActiveRecord::Base
  belongs_to :user
  belongs_to :meme

  validates :user_id, presence: true
  validates :meme_id, presence: true
  validates :text, presence: true, length: { maximum: 500 }
end
