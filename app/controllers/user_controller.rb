require './config/environment'
class UserController < ApplicationController
  get '/users/:id' do
    if session[:user_id] == params[:id]
      @user ||= User.find_by_id(params[:id])
      if @user 
        erb :'users/show'
      else
        flash[:find_user_error] = "Error: Failed to find user with id #{params[:id]}"
      end
    else
      flash[:show_user_error] = 'Error: Insufficent authorization to view this page'
      redirect '/signin'
    end
  end
end
