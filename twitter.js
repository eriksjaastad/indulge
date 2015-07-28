var Twitter = require('twitter');
var client = new Twitter ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});



client.stream('statuses/filter', {locations: '-122.41, 47.54, -122.24, 47.70'}, function(stream) {
  console.log("stream opened");

  stream.on('data', function(tweet) {
    var now = new Date();
    if(!tweet.geo) {return}
    else {
      //console.log(now.format('dd/M/yy h:mm tt'));
      console.log(tweet.text);
      console.log(tweet.geo.coordinates[0]);
      console.log(tweet.geo.coordinates[1]);
    }
  });

  stream.on('error', function(error) {
    console.error(error);
  });

  stream.on("end", console.log.bind(console));
});
