module Models
  class Meme < ActiveRecord::Base
    belongs_to :user
    has_many :ratings, dependent: :destroy
  end
end
