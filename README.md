# indulge
Group project Luke Gabrieli, Justin DeLuna and Erik Sjaastad

## MongoDB
Create a directory named db in your project root.
`mkdir db`

Set the path to the database
`mongod --dbpath=./db --smallfiles`

To check tweet count
```
$mongo
>use 27017
>db.tweets.counts()
```

## Twitter
Set up an account here https://apps.twitter.com/
You'll need:
* consumer_key
* consumer_secret
* access_token_key
* access_token_secret

DO NOT put these keys in your app, set them to an environment variable
In the console:
*notice there are no spaces around the `=`
```
export TWITTER_CONSUMER_KEY=your-consumer-key
export TWITTER_CONSUMER_SECRET=your-consumer-secret
export TWITTER_ACCESS_TOKEN_KEY=your-access-token
export TWITTER_ACCESS_TOKEN_SECRET=your-access-token-secret
```

Then add them in to your app like this:
```
var client = new Twitter ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
```

## Heroku
* Make an account at https://www.heroku.com/
* Here is a great walkthrough https://devcenter.heroku.com/start
* Check if you have the Heroku CLI `heroku --version`
* To check where you have the Heroku toolbelt installed `which heroku` Heroku should not be installed in a gem directory
** If it is `gem uninstall heroku --all`
* Get the Heroku toolbelt https://toolbelt.heroku.com and follow the directions
* More info can be found at https://devcenter.heroku.com/articles/heroku-command

### Create a Heroku remote
Make sure you are in the root of your project
```
heroku create
email
pass
```

Now check your remote
`git remote -v`

You should see something like
```
heroku  https://git.heroku.com/radiant-evermore-4137.git (fetch)
heroku  https://git.heroku.com/radiant-evermore-4137.git (push)
origin  https://github.com/your-git-repo/indulge.git (fetch)
origin  https://github.com/your-git-repo/indulge.git (push)
```

### Deploying to Heroku
`git push heroku master`

If you want to test out branches on Heroku, you can either merge your branch with master or use:
`git push heroku your-branch:master`

`heroku ps:scale web=1`

`heroku open`

This should open your browser to your apps url.

See an error?

`heroku logs --tail` and Control/Command + C to get out of streaming the logs

Heroku looks for server.js by default but you can make a Procfile to make sure.
* To make a Prokfile - make a new file with no extention and name it Procfile and put the following in it
`web: node index.js`
* Use whatever file you're using ass the access file.



