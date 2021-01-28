ENV['SINATRA_ENV'] ||= 'development'

require 'bundler/setup'
Bundler.require(:default, ENV['SINATRA_ENV'])

set :database, { adapter: 'sqlite3', database: "db/#{ENV['SINATRA_ENV']}.sqlite3" }

require_all './app'

CarrierWave.configure do |config|
  config.root = './public/'
end

IMGKit.configure do |config|
  config.default_options = { 'no-images' => false }
end
