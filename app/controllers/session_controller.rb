require './config/environment'

class SessionController < ApplicationController
  post '/signup' do
    username = params[:user][:username]
    password = params[:user][:password]
    user = User.new(username: username, password: password)
    if user.save
      redirect '/signin'
    else
      flash[:signup_error] = 'Error: Failed to create user'
      redirect '/signup'
    end
  end

  get '/signin' do
    erb :signin
  end

  post '/signin' do
    redirect '/account'
  end
end
