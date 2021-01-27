require './config/environment'
class UserController < ApplicationController
  get '/users/:id' do
    @user ||= User.find_by_id(params[:id])
    if @user
      erb :'users/show'
    else
      flash[:show_user_error] = 'Error: Failed to display account page'
      redirect '/signin'
    end
  end
end
