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
    username = params[:user][:username]
    password = params[:user][:password]
    user = User.find_by(username: username)
    if user&.authenticate(password)
      session[:user_id] = user.id
      redirect "/users/#{user.id}"
    else
      flash[:signin_error] = "Error: Failed to authenticate"
      redirect '/signin'
    end
  end

  get '/signout' do
    if session[:user_id]
      session[:user_id].delete
      flash[:signout_success] = "Success: You have been signed out"
      redirect '/signin'
    else
      flash[:signout_error] = "Error: You are already signed out!"
      redirect 'signin'
    end
  end
end
