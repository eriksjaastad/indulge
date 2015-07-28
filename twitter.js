var app = require('express')();
var mongo = require('mongodb');
var Twitter = require('twitter');

var client = new Twitter ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

mongo.connect('mongodb://localhost/27017', function(err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully connected to MongoDB...\n');
  }

  var col = db.collection('tweets');

  client.stream('statuses/filter', {locations: '-122.41, 47.54, -122.24, 47.70'}, function(stream) {
    console.log('Stream has started...\n');
    stream.on('data', function(tweet) {
      if (tweet.geo) {
        col.insert({curDate: new Date().toISOString(), text: tweet.text, latitute: tweet.geo.coordinates[1],longitude: tweet.geo.coordinates[0]});
        console.log(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
      }
    });

    stream.on('error', function(error) {
      console.error(error);
    });

    stream.on('end', console.log.bind(console));
  });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('\nServer is now running on port ' + port + '...\n');
});
