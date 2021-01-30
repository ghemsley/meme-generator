require './config/environment'
class Rating < ActiveRecord::Base
  belongs_to :user
  belongs_to :meme

  validates :user_id, presence: true
  validates :meme_id, presence: true
  validates :number, presence: true, inclusion: { in: 0..10 }
end
