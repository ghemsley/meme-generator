require './config/environment'

class CommentsController < ApplicationController
  post '/comments' do 
    if signed_in?
      user = current_user
      if user && user.id == params[:comment][:user_id].to_i
        comment = Comment.new
        comment.user_id = user.id
        comment.meme_id = Meme.find_by_id(params[:comment][:meme_id])&.id
        comment.text = params[:comment][:text]
        if comment.save
          flash[:success] = "Success: Posted a new comment!"
          redirect "/memes/#{params[:comment][:meme_id]}"
        else
          flash[:error] = "Error: Failed to save comment"
          redirect "/memes/#{params[:comment][:meme_id]}"
        end
      else
        flash[:error] = "Error: Failed getting current user"
        redirect '/signin'
      end
    else
      flash[:error] = "Error: You are not signed in"
    end
  end
end
