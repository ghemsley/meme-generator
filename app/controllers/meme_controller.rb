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
        image = params[:meme][:image][:tempfile].read
        meme = Meme.new(user_id: user_id, name: name, image: image)
        if meme.save
          flash[:success] = 'Success: Created a new meme!'
        else
          flash[:error] = 'Error: Failed to create meme'
        end
        redirect "/users/#{session[:user_id]}"
      else
        flash[:error] = "Error: Failed to find user with id #{user_id}"
        redirect "/users/#{user_id}"
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end
end
