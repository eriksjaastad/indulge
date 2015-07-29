# indulge
Group project Luke Gabrieli, Justin DeLuna and Erik Sjaastad

## MongoDB
Create a directory named db in your project root.
`mkdir db`

Set the path to the database
`mongod --dbpath=./db --smallfiles`

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
