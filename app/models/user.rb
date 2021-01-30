require './config/environment'
class User < ActiveRecord::Base
  has_many :memes, dependent: :destroy
  has_many :ratings, through: :memes, dependent: :destroy
  has_many :comments, through: :memes, dependent: :destroy

  validates :username, presence: true, uniqueness: true
  has_secure_password
end
