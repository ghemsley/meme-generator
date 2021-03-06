# Meme Generator

A Sinatra/Activerecord app for generating tasty memes

[Demo](https://wow-meme-generator.herokuapp.com)

![Meme Generator homepage](./homepage.png)

## Installation

This project uses NodeJS and Ruby, so you will need those set up first. You can use npm or yarn to install the NodeJS dependencies, but this readme will assume Yarn.

1. Clone the repository using your preferred method, then navigate to the directory git creates for it using your terminal (it should be called meme-generator).
2. At the project's root directory, run `bundle install`. 
3. Once that finishes, you'll want to run `yarn install`. 
4. To make sure the Javascript scripts are properly compiled, you should run `yarn build`. It should generate some scripts in the `./public/js` directory. 
5. After that, you can run the migrations to setup the database: `rake db:migrate`
6. If that successfully completes, the next step is to setup some environment variables. Unless you want to use a dotfile (which will require some extra setup not covered here), you can enter the following:
7. `export SINATRA_SESSION_SECRET=(enter your preferred secret here, minus parentheses)`
8. `export SINATRA_ADMIN_PASSWORD=(enter your preferred admin password here, minus parentheses)`
9. This project is configured to use an AWS S3 bucket for file storage. You can set up your own bucket on the free tier, but that is outside the scope of this readme. However, if you do want to do this, check the file `/config/environment.rb` to see what other environment variables you will need to set to get the bucket storage working (the relevant variables are inside the Carrierwave config block). Alternatively, you can modify the `/app/uploader/image_uploader.rb` file to use `:file` storage instead of `:fog` to have the uploads saved locally instead of to S3. If you do that, you will want to uncomment the commented line starting with `config.root` in `/config/environment.rb`.
10. Now the project should be ready to launch with `rackup`. The homepage should then be ready to view at `http://localhost:9292`

## Usage

To create a meme, first sign up, then sign in, and then hit the 'Create a meme!' button, accessible from any page while signed in.

To create an admin user, enter the username `Admin` at the signup page, followed by whatever password you set as an environment variable earlier.

Users can be followed by navigating to a user's account page while signed in. The easiest way to find that is to click the author's name while on a meme's detail view page.

Once followed, your account page will have a few links that should be populated with data now. There should be links to view your followed users, users that are following you, and your feed, which is a list of all the memes made by users you follow.

To unfollow someone, navigate to their user account page and click the 'Unfollow' button.

Memes can be liked, unliked, commented on, edited and deleted. Comments can be edited and deleted as well. Users can edit or delete their accounts as long as they know their current password, otherwise the admin user can also edit and delete any account that has been created.

Once you've liked some memes, they should show up on your 'Likes' page, accessible from your user's account page.

This app hasn't been tested with very large images very much, so there may be some limitations there.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/ghemsley/meme-generator

## License

[MIT License](./LICENSE)
