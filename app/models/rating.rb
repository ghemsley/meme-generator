require './config/environment'
class Rating < ActiveRecord::Base
  belongs_to :meme
  validates :number, presence: true, inclusion: { in: 0..10 }
end
