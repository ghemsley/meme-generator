require './config/environment'

class ApplicationController < Sinatra::Base
  register(Sinatra::JS)
  configure do
    set :public_folder, 'public'
    set :views, 'app/views'
    enable :sessions
  end

  get '/' do
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
  end
end
