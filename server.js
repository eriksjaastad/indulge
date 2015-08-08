
'use strict';

var mongo = require('mongodb');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('twitter');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/27017';


var client = new Twitter ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.use(express.static(__dirname + '/public'));
app.set('port', (process.env.PORT || 3000));

mongo.connect(mongoURI, function(err, db) {   //open mongo connection
  if(err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB...\n');
  }

  var col = db.collection('tweets');
  client.stream('statuses/filter', {locations: '-122.41, 47.54, -122.24, 47.70'}, function(stream) {    //start twitter data stream
    console.log("Twitter stream has started...\n");

    stream.on('data', function(tweet) { //start twitter DATA
      //sanity check for incoming data
      console.log('searching for data...');
      if (tweet.geo && (tweet.text.toLowerCase().indexOf('#hire') < 0 ) && (tweet.text.toLowerCase().indexOf('#hiring') < 0 ) && (tweet.text.toLowerCase().indexOf('#job') < 0)) {
        var curTime = new Date();
        var newTweet = {
          curDate: new Date().toISOString(),
          text: tweet.text,
          longitude: tweet.geo.coordinates[1],
          latitude: tweet.geo.coordinates[0]
        };

        col.insert(newTweet);  //save new tweet to db
        io.emit('newTweet', newTweet); //send new tweet to front end
        console.log(tweet.text);
      }
    }); //end twitter DATA

    io.on('connection', function(socket) {  //open socket when user connects
      //sanity check for connection start
      console.log('A new user has connected!\n');

      //send tweets that are already in db to client
      col.find().sort({curDate: -1}).limit(500).toArray(function(err, result) {
        if (err) {
          console.log(err);
        }
        io.emit('output', result);
      });
      //socket disconnect message
      socket.on('disconnect', function () {
        console.log('User disconnected!\n');
      });
    }); //end socket connection
  }); //end twitter stream
}); //end mongo connection

http.listen(app.get('port'), function() {
  console.log('\nServer is now running on port ' + app.get('port') + '...\n');
});
