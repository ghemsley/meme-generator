class CreateRatings < ActiveRecord::Migration[6.1]
  def change
    create_table :ratings do |t|
      t.belongs_to :meme
      t.integer :number
      t.timestamps null: false
    end
  end
end
