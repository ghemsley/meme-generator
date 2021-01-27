class CreateRatings < ActiveRecord::Migration[6.1]
  def change
    create_table :ratings do |t|
      t.references :meme, foreign_key: { on_delete: :cascade }
      t.integer :number
      t.timestamps null: false
    end
  end
end