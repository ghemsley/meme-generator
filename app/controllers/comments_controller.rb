require './config/environment'

class CommentsController < ApplicationController
  get '/comments/:id/edit' do
    if signed_in?
      @user = current_user
      if @user
        @comment = Comment.find_by_id(params[:id])
        if @comment
          if @comment&.user_id == @user.id || @user.admin
            erb :'comments/edit'
          else
            flash[:error] = "Error: You don't have the proper authorization"
            redirect '/'
          end
        else
          flash[:error] = "Error: Could not find comment with id #{params[:id]}"
          redirect '/'
        end
      else
        flash[:error] = 'Error: Could not find current user'
        redirect '/'
      end
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end

  post '/comments' do
    if signed_in?
      user = current_user
      if user&.id == params[:comment][:user_id].to_i
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

  patch '/comments/:id' do
    if signed_in?
      user = current_user
      if user&.id == params[:comment][:user_id].to_i || user&.admin
        comment = Comment.find_by_id(params[:id])
        comment.text = Sanitize.fragment(params[:comment][:text])
        if comment.save
          flash[:success] = 'Success: Edited a comment!'
        else
          flash[:error] = 'Error: Failed to save comment'
        end
        redirect "/memes/#{comment.meme_id}"
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
      if user.id == comment.user_id || user.admin
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
