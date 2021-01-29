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
end
