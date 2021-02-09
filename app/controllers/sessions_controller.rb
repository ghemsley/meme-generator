require './config/environment'

class SessionsController < ApplicationController
  get '/signin' do
    erb :'sessions/signin'
  end

  post '/signin' do
    username = params[:user][:username]
    password = params[:user][:password]
    user = User.find_by(username: username)
    if user&.authenticate(password)
      session[:user_id] = user.id
      flash[:success] = 'Success: You have been signed in!'
      redirect "/users/#{user.id}"
    else
      flash[:error] = 'Error: Failed to authenticate'
      redirect '/signin'
    end
  end

  get '/signout' do
    if session[:user_id]
      session.delete(:user_id)
      flash[:success] = 'Success: You have been signed out!'
      redirect '/'
    else
      flash[:error] = 'Error: You are already signed out'
      redirect '/'
    end
  end
end
