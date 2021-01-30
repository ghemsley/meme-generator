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
      user_id = session[:user_id]
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
          flash[:error] = 'Error: Failed to create meme'
        end
      else
        flash[:error] = "Error: Failed to find user with id #{user_id}"
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
    @meme = Meme.find_by_id(params[:id])
    erb :"memes/show"
  end

  get '/memes' do
    @memes = Meme.all
    erb :'memes/index'
  end
end
