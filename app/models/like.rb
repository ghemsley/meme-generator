require './config/environment'
class Like < ActiveRecord::Base
  belongs_to :user
  belongs_to :meme

  validates :user_id, presence: true
  validates :meme_id, presence: true
end
