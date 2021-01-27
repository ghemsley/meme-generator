class CreateMemes < ActiveRecord::Migration[6.1]
  def change
    create_table :memes do |t|
      t.references :user, foreign_key: { on_delete: :cascade }
      t.string :name
      t.string :top_caption
      t.string :bottom_caption
      t.binary :image
      t.timestamps null: false
    end
  end
end
