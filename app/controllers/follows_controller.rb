require './config/environment'

class FollowsController < ApplicationController
  post '/follows' do
    if signed_in?
      user = current_user
      if user && user.id == params[:like][:user_id].to_i
        follow = Follow.new
        follow.follower_id = user.id
        follow.followed_user_id = User.find_by_id(params[:follow][:user_id])&.id
        if follow.save
          flash[:success] = 'Success: Followed a user!'
        else
          flash[:error] = 'Error: Failed to follow user'
        end
        redirect "/users/#{params[:follow][:user_id]}"
      else
        flash[:error] = 'Error: Failed getting current user'
        redirect '/signin'
      end
    else
      flash[:error] = 'Error: You are not signed in'
    end
  end

  delete '/follows/:id' do
    if signed_in?
      user = current_user
      follow = Follow.find_by_id(params[:id])
      user_id = Follow.followed_user.id
      if user.id == follow.follower.id
        if follow.destroy
          flash[:success] = 'Success: Unfollowed a user!'
        else
          flash[:error] = 'Error: Failed to unfollow user'
        end
      else
        flash[:error] = 'Error: You do not have the required permissions'
      end
      redirect "/users/#{user_id}"
    else
      flash[:error] = 'Error: You are not signed in'
      redirect '/signin'
    end
  end
end
