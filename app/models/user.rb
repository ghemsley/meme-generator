require './config/environment'
class User < ActiveRecord::Base
  has_many :memes, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy

  has_many :received_follows, foreign_key: :followed_user_id, class_name: 'Follow'
  has_many :followers, through: :received_follows, source: :follower

  has_many :given_follows, foreign_key: :follower_id, class_name: 'Follow'
  has_many :followings, through: :given_follows, source: :followed_user

  validates :username, presence: true, uniqueness: true, format: { with: /\w+/,
                                                                   message: 'Alphanumeric characters, including underscore' }
  has_secure_password
end
