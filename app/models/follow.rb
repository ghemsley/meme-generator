require './config/environment'

class Follow < ActiveRecord::Base
  belongs_to :follower, foreign_key: :follower_id, class_name: 'User'
  belongs_to :followed_user, foreign_key: :followed_user_id, class_name: 'User'

  validates :follower_id, presence: true
  validates :followed_user_id, presence: true
end
