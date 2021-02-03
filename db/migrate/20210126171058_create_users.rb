class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :password_digest
      t.timestamps null: false
    end
    add_column :users, :admin, :boolean, :null => false, :default => false
  end
end
