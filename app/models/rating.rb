module Models
  class Rating < ActiveRecord::Base
    belongs_to :meme
    validates :number, inclusion: { in: 0..10 }
  end
end
