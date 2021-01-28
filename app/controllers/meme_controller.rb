require './config/environment'

class MemeController < ApplicationController
  get '/memes/create' do
    if session[:user_id]
      user = User.find_by_id(session[:user_id])
      if user
        erb :'memes/create'
      else
        flash[:error] = "Error: Failed to find user with id #{session[:user_id]}"
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  post '/memes/create' do
    if session[:user_id]
      user_id = session[:user_id]
      user = User.find_by_id(user_id)
      if user
        name = params[:meme][:name]
        top_caption = params[:meme][:top_caption]
        bottom_caption = params[:meme][:bottom_caption]
        kit = IMGKit.new(params[:meme][:html])
        kit.stylesheets << './public/css/app.css'
        file = Tempfile.new(params[:meme][:name].gsub(' ', '').to_s, '/tmp', encoding: 'ascii-8bit')
        file.write(kit.to_jpg)
        file.flush
        meme = Meme.new
        meme.user_id = user.id
        meme.name = name
        meme.top_caption = top_caption
        meme.bottom_caption = bottom_caption
        meme.image = file
        if meme.save
          flash[:success] = 'Success: Created a new meme!'
          file.unlink
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
    erb :'memes/list'
  end
end
