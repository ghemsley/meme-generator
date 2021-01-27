require './config/environment'
class UserController < ApplicationController
  get '/users/:id' do
    if session[:user_id] == params[:id].to_i
      @user ||= User.find_by_id(session[:user_id])
      if @user
        @memes = User.find_by_id(1).memes.all
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
end
