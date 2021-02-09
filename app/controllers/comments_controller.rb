require './config/environment'

class CommentsController < ApplicationController
  post '/comments' do
    if signed_in?
      user = current_user
      if user && user.id == params[:comment][:user_id].to_i
        comment = Comment.new
        comment.user_id = user.id
        comment.meme_id = Meme.find_by_id(params[:comment][:meme_id])&.id
        comment.text = Sanitize.fragment(params[:comment][:text])
        if comment.save
          flash[:success] = 'Success: Posted a new comment!'
        else
          flash[:error] = 'Error: Failed to save comment'
        end
        redirect "/memes/#{params[:comment][:meme_id]}"
      else
        flash[:error] = 'Error: Failed getting current user'
        redirect '/'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  delete '/comments/:id' do
    if signed_in?
      user = current_user
      comment = Comment.find_by_id(params[:id])
      meme_id = comment.meme.id
      if user.id == comment.user.id || user.admin
        if comment.destroy
          flash[:success] = 'Success: Deleted comment!'
        else
          flash[:error] = 'Error: Failed to delete comment'
        end
      else
        flash[:error] = 'Error: You do not have the required permissions'
      end
      redirect "/memes/#{meme_id}"
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end
end
