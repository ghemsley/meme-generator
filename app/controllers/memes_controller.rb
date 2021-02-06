require './config/environment'

class MemesController < ApplicationController
  get '/memes/new' do
    if signed_in?
      @user = current_user
      if @user
        erb :'memes/new'
      else
        flash[:error] = "Error: Failed to find user with id #{session[:user_id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  post '/memes' do
    if signed_in?
      user = current_user
      if user
        name = params[:meme][:name]
        top_caption = params[:meme][:top_caption]
        bottom_caption = params[:meme][:bottom_caption]
        image = params[:meme][:image]
        original_image = params[:meme][:original_image]
        meme = Meme.new
        meme.user_id = user.id
        meme.name = name
        meme.top_caption = top_caption
        meme.bottom_caption = bottom_caption
        meme.image = image
        meme.original_image = original_image
        if meme.save
          flash[:success] = 'Success: Created a new meme!'
        else
          flash[:error] = 'Error: Failed to create meme, try a different name'
        end
      else
        flash[:error] = "Error: Failed to find user with id #{session[:user_id]}"
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  get '/memes/:id/edit' do
    if signed_in?
      @user = current_user
      if @user
        @meme = Meme.find_by_id(params[:id])
        if @meme
          erb :"memes/edit"
        else
          flash[:error] = "Error: failed to find meme with id #{params[:id]}"
          redirect "/users/#{@user.id}"
        end
      else
        flash[:error] = "Error: Failed to find user with id #{session[:user_id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  get '/memes/:id' do
    if session[:user_id]
      @user = current_user
      if @user
        @meme = Meme.find_by_id(params[:id])
        if @meme
          erb :'memes/show'
        else
          flash[:error] = "Error: Failed to find meme with id #{params[:id]}"
          redirect "/"
        end
      else
        flash[:error] = "Error: Failed to find user with id #{session[:user_id]}"
        redirect '/signin'
      end
    elsif !session[:user_id]
      @meme = Meme.find_by_id(params[:id])
      if @meme
        @user = User.find_by_id(@meme.user.id)
        if @user
          erb :'memes/show'
        else
          flash[:error] = "Error: Failed to find user with id #{@meme.user.id}"
          redirect '/signin'
        end
      else
        flash[:error] = "Error: Failed to find meme with id #{params[:id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: Could not find page at that url'
      redirect '/signin'
    end
  end

  patch '/memes/:id' do
    if signed_in?
      user = current_user
      if user
        meme = Meme.find_by_id(params[:id])
        if meme
          if user.memes.find_by_id(meme.id)
            meme.name = params[:meme][:name] if params[:meme][:name]
            meme.top_caption = params[:meme][:top_caption] if params[:meme][:top_caption]
            meme.bottom_caption = params[:meme][:bottom_caption] if params[:meme][:bottom_caption]
            meme.image = params[:meme][:image] if params[:meme][:image]
            meme.original_image = params[:meme][:image] if params[:meme][:image]
            if meme.save
              flash[:success] = 'Success: Edits were saved!'
            else
              flash[:error] = 'Error: Failed to save edits'
              redirect "/memes/#{meme.id}/edit"
            end
          else
            flash[:error] = "Error: You don't have access to this meme"
            redirect "/users/#{user.id}"
          end
        else
          flash[:error] = "Error: Failed to find meme with id #{params[:id]}"
          redirect "/users/#{user.id}"
        end
      else
        flash[:error] = 'Error: You are not signed in'
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  delete '/memes/:id' do
    if signed_in?
      user = current_user
      if user
        meme = Meme.find_by_id(params[:id])
        if meme
          if meme.destroy
            flash[:success] = 'Success: Deleted meme!'
            redirect "/users/#{user.id}/memes"
          else
            flash[:error] = 'Error: Failed to delete meme'
            redirect "/users/#{user.id}/memes/#{meme.id}"
          end
        else
          flash[:error] = "Error: Failed to find meme with id #{params[:id]}"
          redirect "/users/#{user.id}/memes"
        end
      else
        flash[:error] = "Error: Failed to find user with id #{params[:id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  get '/memes' do
    @memes = Meme.all
    erb :'memes/index'
  end
end
