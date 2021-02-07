require './config/environment'
class User < ActiveRecord::Base
  has_many :memes, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy

  validates :username, presence: true, uniqueness: true, format: { with: /\w+/,
                                                                   message: 'Alphanumeric characters, including underscore' }
  has_secure_password
end
