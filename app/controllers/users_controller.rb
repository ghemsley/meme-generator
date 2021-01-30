require './config/environment'
class UsersController < ApplicationController
  get '/users/:user_id/memes/:meme_id' do
    if session[:user_id] == params[:user_id].to_i
      @user = current_user
      if @user
        @meme = @user.memes.find_by_id(params[:meme_id])
        if @meme
          erb :'users/meme'
        else
          flash[:error] = "Error: Failed to find meme with id #{params[:meme_id]}"
          redirect "/users/#{@user.id}/memes"
        end
      else
        flash[:error] = "Error: Failed to find user with id #{params[:user_id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: Insufficent authorization to view this page'
      redirect '/signin'
    end
  end

  get '/users/:id/memes' do
    if session[:user_id] == params[:id].to_i
      @user = current_user
      if @user
        @memes = @user.memes
        erb :'users/memes'
      else
        flash[:error] = "Error: Failed to find user with id #{params[:id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: Insufficent authorization to view this page'
      redirect '/signin'
    end
  end

  get '/users/:id/edit' do
    if session[:user_id] == params[:id].to_i
      @user = current_user
      if @user
        erb :'users/edit'
      else
        flash[:error] = "Error: Failed to find user with id #{params[:id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: Insufficent authorization to view this page'
      redirect '/signin'
    end
  end

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
      flash[:error] = 'Error: Failed to create user, please try a different username'
      redirect '/signup'
    end
  end

  patch '/users/:id' do
    if session[:user_id] == params[:id].to_i
      user = current_user
      if user
        if params[:user][:password] && user.authenticate(params[:user][:password])
          user.username = params[:user][:username] if params[:user][:username]
          user.password = params[:user][:new_password] if params[:user][:new_password]
          if user.save
            flash[:success] = 'Success: Updated account!'
          else
            flash[:error] = 'Error: Failed to update account'
          end
        else
          flash[:error] = 'Error: Failed to authenticate'
        end
        redirect "/users/#{user.id}"
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
