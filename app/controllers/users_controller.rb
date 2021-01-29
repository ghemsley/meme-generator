require './config/environment'
class UsersController < ApplicationController
  get '/users/:id' do
    if session[:user_id] == params[:id].to_i
      @user = current_user
      if @user
        @memes = @user.memes
        erb :'users/show'
      else
        flash[:error] = "Error: Failed to find user with id #{params[:id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: Insufficent authorization to view this page'
      redirect '/signin'
    end
  end

  get '/users' do
    @users = User.all
    erb :"users/index"
  end

  get '/signup' do
    erb :'users/signup'
  end

  post '/signup' do
    username = params[:user][:username]
    password = params[:user][:password]
    user = User.new(username: username, password: password)
    if user.save
      flash[:success] = 'Success: Your account has been created!'
      redirect '/signin'
    else
      flash[:error] = 'Error: Failed to create user'
      redirect '/signup'
    end
  end
end
