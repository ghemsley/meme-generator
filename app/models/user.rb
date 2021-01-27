module Models
  class User < ActiveRecord::Base
    validates :username, presence: true, uniqueness: true
    has_secure_password
    has_many :memes, dependent: :destroy
    has_many :ratings, through: :memes
  end
end
