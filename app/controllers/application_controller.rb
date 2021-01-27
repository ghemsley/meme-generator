require './config/environment'
require 'sinatra/flash'
require 'securerandom'
class ApplicationController < Sinatra::Base
  configure do
    set :server, :puma
    set :public_folder, 'public'
    set :views, 'app/views'
    use Rack::Session::Cookie, key: 'rack.session',
                               path: '/',
                               secret: SecureRandom.hex(64)
    register(Sinatra::JS)
    register(Sinatra::Flash)
  end

  get '/' do
    erb :index
  end

  helpers do
    def signed_in?
      if session[:user_id] || @user
        true
      else
        false
      end
    end

    def current_user
      if @user
        @user
      elsif session[:user_id]
        @user ||= User.find_by_id(session[:user_id])
        @user
      end
    end
  end
end
