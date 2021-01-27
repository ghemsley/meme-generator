require './config/environment'

class SessionController < ApplicationController
  get '/signup' do
    erb :'sessions/signup'
  end

  post '/signup' do
    username = params[:user][:username]
    password = params[:user][:password]
    user = User.new(username: username, password: password)
    if user.save
      flash[:success] = 'Success: Your account has been created'
      redirect '/signin'
    else
      flash[:signup_error] = 'Error: Failed to create user'
      redirect '/signup'
    end
  end

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
      redirect '/signin'
    else
      flash[:error] = 'Error: You are already signed out'
      redirect 'signin'
    end
  end
end
