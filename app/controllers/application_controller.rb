require './config/environment'
require 'sinatra/flash'
require 'securerandom'
require 'carrierwave'
require 'carrierwave/orm/activerecord'
class ApplicationController < Sinatra::Base
  configure do
    set :server, :puma
    set :public_folder, 'public'
    set :views, 'app/views'
    use Rack::MethodOverride
    use Rack::Session::Cookie, key: 'rack.session',
                               path: '/',
                               secret: SecureRandom.hex(64)
    register(Sinatra::JS)
    register(Sinatra::Flash)
  end

  not_found do
    flash[:error] = 'Error: Requested resource was not found'
    redirect '/'
  end

  get '/' do
    latest_count = [Meme.all.size, 9].min
    @memes = Meme.last(latest_count)
    erb :index
  end

  helpers do
    def signed_in?
      if session[:user_id]
        true
      else
        false
      end
    end

    def current_user
      return unless session[:user_id]

      @user = User.find_by_id(session[:user_id])
      @user
    end
  end
end
