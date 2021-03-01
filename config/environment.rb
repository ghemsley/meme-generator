# ENV['SINATRA_ENV'] ||= 'development'

require 'bundler/setup'
Bundler.require(:default)

require 'sinatra/flash'
require 'carrierwave'
require 'carrierwave/orm/activerecord'
require 'sanitize'
require 'digest'

configure :development do
  set :database, { adapter: 'sqlite3', database: 'db/development.sqlite3' }
  set :show_exceptions, true
end

configure :production do
  db = URI.parse(ENV['DATABASE_URL'] || 'postgres:///localhost/memegenerator')

  ActiveRecord::Base.establish_connection(
    adapter: db.scheme == 'postgres' ? 'postgresql' : db.scheme,
    host: db.host,
    username: db.user,
    password: db.password,
    database: db.path[1..-1],
    encoding: 'utf8'
  )
end

CarrierWave.configure do |config|
  # config.root = './public/'
  config.fog_credentials = {
    provider: 'AWS',
    aws_access_key_id: ENV['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'], 
    use_iam_profile: false, 
    region: ENV['AWS_REGION'] 
  }
  config.fog_directory = ENV['S3_BUCKET_NAME']                                      # required
end

require_all './app'
