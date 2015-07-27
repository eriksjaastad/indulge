var Twitter = require('twitter');
var client = new Twitter ({
  consumer_key: 'process.env.TWITTER_CONSUMER_KEY',
  consumer_secret: 'process.env.TWITTER_CONSUMER_SECRET',
  access_token_key: 'process.env.TWITTER_ACCESS_TOKEN_KEY',
  access_token_secret: 'process.env.TWITTER_ACCESS_TOKEN_SECRET'
});



client.stream('statuses/filter', {track: 'Seattle'}, function(stream) {
  console.log("stream opened");

  stream.on('data', function(tweet) {
    console.log(tweet.text);
  });

  stream.on('error', function(error) {
    console.error(error);
  });

  stream.on("end", console.log.bind(console));
});
