require './config/environment'

class LikesController < ApplicationController
  post '/likes' do
    if signed_in?
      user = current_user
      if user && user.id == params[:like][:user_id].to_i
        like = Like.new
        like.user_id = user.id
        like.meme_id = Meme.find_by_id(params[:like][:meme_id])&.id
        if like.save
          flash[:success] = 'Success: Liked a meme!'
        else
          flash[:error] = 'Error: Failed to like meme'
        end
        redirect "/memes/#{params[:like][:meme_id]}"
      else
        flash[:error] = 'Error: Failed getting current user'
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
    end
  end

  delete '/likes/:id' do
    if signed_in?
      user = current_user
      like = Like.find_by_id(params[:id])
      meme_id = like.meme.id
      if user.id == like.user.id
        if like.destroy
          flash[:success] = 'Success: Unliked a meme!'
        else
          flash[:error] = 'Error: Failed to unlike meme'
        end
        redirect "/memes/#{meme_id}"
      else
        flash[:error] = 'Error: You do not have the required permissions'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end
end
