require './config/environment'

class MemesController < ApplicationController
  get '/memes/new' do
    if session[:user_id]
      user = User.find_by_id(session[:user_id])
      if user
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
    if session[:user_id]
      user_id = session[:user_id]
      user = User.find_by_id(user_id)
      if user
        name = params[:meme][:name]
        top_caption = params[:meme][:top_caption]
        bottom_caption = params[:meme][:bottom_caption]
        image = params[:meme][:image]
        meme = Meme.new
        meme.user_id = user.id
        meme.name = name
        meme.top_caption = top_caption
        meme.bottom_caption = bottom_caption
        meme.image = image
        if meme.save
          flash[:success] = 'Success: Created a new meme!'
          redirect "/memes/#{meme.id}"
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

  get '/memes/:id' do
    @meme = Meme.find_by_id(params[:id])
    erb :"memes/show"
  end

  get '/memes' do
    @memes = Meme.all
    erb :'memes/index'
  end
end