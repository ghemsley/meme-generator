# ENV['SINATRA_ENV'] ||= 'development'

require 'bundler/setup'
Bundler.require(:default)

#set :database, { adapter: 'sqlite3', database: "db/#{ENV['SINATRA_ENV']}.sqlite3" }
#set :database, { adapter: 'postgresql', database: ENV['DATABASE_URL'] || 'postgres://localhost/memegenerator' }

require_all './app'

CarrierWave.configure do |config|
  config.root = './public/'
end

ActiveRecord::Base.establish_connection(adapter: 'postgresql', encoding: 'utf8', database: ENV['DATABASE_URL'] || 'postgres://localhost/memegenerator')
