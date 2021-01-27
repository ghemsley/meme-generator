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
  end
end
