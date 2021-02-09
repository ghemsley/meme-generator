ENV['SINATRA_ENV'] ||= 'development'

require 'bundler/setup'
Bundler.require(:default, ENV['SINATRA_ENV'])

if ENV['SINATRA_ENV'] == 'development'
  set :database, { adapter: 'sqlite3', database: "db/#{ENV['SINATRA_ENV']}.sqlite3" }
end

require_all './app'

CarrierWave.configure do |config|
  config.root = './public/'
end

ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/memegenerator')
