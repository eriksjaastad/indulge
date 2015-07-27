var express = require('express');
var app = express();

var Twitter = require('twitter');
var mongo = require('mongodb');
//var mongoose = require('mongoose');


var client = new Twitter ({
  consumer_key: 'AOztrA5dsNyCNER0g89k0slQi',
  consumer_secret: 'kxmTIpyvgr9hJq1KkzFE9E2noVZ9VDALMz8qKFOudAJipBEEbW',
  access_token_key: '16349436-U5gvCtG0Qk23j5JeJOpXy4AJtSSp7xuDmuCinJKpq',
  access_token_secret: 'IQpkWFvNM8zB8x0Q2O82BJLTYzoqeMjCJUu3aN3HVEKny'
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

