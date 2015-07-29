var express = require('express');
var app = express();

var Twitter = require('twitter');
var mongo = require('mongodb');


var client = new Twitter ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

  // http://www.svennerberg.com/2009/01/handling-large-amounts-of-markers-in-google-maps/
  // Bulk adding the markers
  //get longitue and lattitude of first tweet id
  //compare longitude and lattiturd to all other tweet locations
  //for each location that is close
  //push locations to markers array
  //if there are no locations close move to the next tweet id
  //create a new marker array and push locations that are close in to it
  //if there are no more tweet id's
  //push all marker arrays to mgr.addMarkers(markers);




mongo.connect('mongodb://localhost/27017', function(err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully connected to MongoDB...\n');
  }


  var col = db.collection('tweets');

// blobber test 1
var blobArr = [];
col.aggregate([
  { $group: {
    _id: '$longitude',
    count: {$sum: 1}
  }},
  {$sort: {
    count: -1
  }},
  {$limit: 20},
  {$project: {
    location: '$_id',
    count: 1,
    _id: 0
  }}
]).toArray(function(err, result) {
  blobArr.push(result);
  console.log(blobArr);
});





  client.stream('statuses/filter', {locations: '-122.41, 47.54, -122.24, 47.70'}, function(stream) {
    console.log('Stream has started...\n');
    stream.on('data', function(tweet) {
      if (tweet.geo) {
        col.insert({curDate: new Date().toISOString(),
                    text: tweet.text,
                    latitute: tweet.geo.coordinates[1],
                    longitude: tweet.geo.coordinates[0],
                    location: {
                      lng: tweet.geo.coordinates[0],
                      lat: tweet.geo.coordinates[1]
                      }
                  });
        console.log(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
      }
    });

    stream.on('error', function(error) {
      console.error(error);
    });

    app.get('/', function(req, res) {
      col.find().toArray(function(err, result) {
        res.json(result);
      });
    });

    stream.on('end', console.log.bind(console));
  });
});
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('\nServer is now running on port ' + port + '...\n');
});

