require './config/environment'
class UsersController < ApplicationController
  get '/users/:id/memes' do
    if session[:user_id] == params[:id]
      @user = current_user
      if @user
        @memes = @user.memes
        erb :'users/memes'
      else
        flash[:error] = "Error: Failed to find user with id #{session[:user_id]}"
        redirect '/signin'
      end
    elsif params[:id]
      @user = User.find_by_id(params[:id])
      if @user
        @memes = @user.memes
        erb :'users/memes'
      else
        flash[:error] = "Error: Failed to find user with id #{params[:id]}"
        redirect '/'
      end
    else
      flash[:error] = 'Error: Insufficent authorization to view this page'
      redirect '/signin'
    end
  end

  get '/users/:id/edit' do
    if signed_in?
      if session[:user_id] == params[:id].to_i
        @user = User.find_by_id(params[:id].to_i)
        if @user
          erb :'users/edit'
        else
          flash[:error] = "Error: Failed to find user with id #{params[:id]}"
          redirect '/signin'
        end
      elsif session[:user_id] != params[:id].to_i
        if current_user.admin
          @user = User.find_by_id(params[:id].to_i)
          erb :'users/edit'
        else
          flash[:error] = 'Error: Insufficient authorization to view this page'
          redirect '/signin'
        end
      else
        flash[:error] = 'Error: Insufficent authorization to view this page'
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  get '/users/:id' do
    if signed_in?
      @user = current_user
      if @user.id == params[:id].to_i
        erb :'users/show'
      elsif @user.admin
        @user = User.find_by_id[params[:id]]
        erb :'users/show'
      else
        flash[:error] = 'Error: Insufficent authorization to view this page'
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
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
    user = if password == admin_password
             User.new(username: username, password: password, admin: true)
           else
             User.new(username: username, password: password)
           end
    if user.save
      flash[:success] = 'Success: Your account has been created!'
      redirect '/signin'
    else
      flash[:error] = 'Error: Failed to create user, please try a different username'
      redirect '/signup'
    end
  end

  patch '/users/:id' do
    if signed_in?
      user = current_user
      if user.id == params[:id].to_i || user.admin
        if params[:user][:password] && user.authenticate(params[:user][:password])
          if user.id == params[:id]
            user.username = params[:user][:username] if params[:user][:username]
            user.password = params[:user][:password] if params[:user][:password]
            if user.save
              flash[:success] = 'Success: saved account info!'
              redirect "/users/#{params[:id]}"
            else
              flash[:error] = 'Error: Failed to save account info, username may be taken'
              redirect "/users/#{params[:id]}/edit"
            end
          elsif user.admin
            user_to_edit = User.find_by_id(params[:id])
            user_to_edit.username = params[:user][:username] if params[:user][:username]
            user_to_edit.password = params[:user][:password] if params[:user][:password]
            if user_to_edit.save
              flash[:success] = 'Success: saved account info!'
              redirect '/'
            else
              flash[:error] = 'Error: Failed to save account info, username may be taken'
              redirect "/users/#{params[:id]}/edit"
            end
          else
            flash[:error] = 'Error: You do not have the required permissions'
            redirect '/'
          end
        else
          flash[:error] = 'Error: Failed to authenticate'
          redirect "/users/#{params[:id]}/edit"
        end
      else
        flash[:error] = 'Error: You do not have the required permissions'
        redirect '/'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  delete '/users/:id' do
    if signed_in?
      user = current_user
      if user.id == params[:id].to_i || user.admin
        if params[:user][:password] && user.authenticate(params[:user][:password])
          if user.id == params[:id]
            if user.destroy
              session.delete(:user_id)
              flash[:success] = 'Success: deleted account!'
              redirect '/signup'
            else
              flash[:error] = 'Error: Failed to delete account'
              redirect "/users/#{params[:id]}/edit"
            end
          elsif user.admin
            user_to_delete = User.find_by_id(params[:id])
            if user_to_delete.destroy
              flash[:success] = 'Success: deleted account!'
              redirect '/'
            else
              flash[:error] = 'Error: Failed to delete account'
              redirect "/users/#{params[:id]}/edit"
            end
          else
            flash[:error] = 'Error: You do not have the required permissions'
            redirect '/'
          end
        else
          flash[:error] = 'Error: Failed to authenticate'
          redirect "/users/#{params[:id]}/edit"
        end
      else
        flash[:error] = 'Error: You do not have the required permissions'
        redirect '/'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end
end
