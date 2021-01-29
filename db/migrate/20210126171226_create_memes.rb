class CreateMemes < ActiveRecord::Migration[6.1]
  def change
    create_table :memes do |t|
      t.references :user, foreign_key: { on_delete: :cascade }
      t.string :name, null: false
      t.string :top_caption, null: false
      t.string :bottom_caption, null: false
      t.string :image, null: false
      t.string :original_image, null: false
      t.timestamps null: false
    end
  end
end
