var mongo = require('mongodb');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twitter = require('twitter');
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/27017';

var client = new Twitter ({
consumer_key: 'SjI0oCWx5l4byUV5sfP1nBE5F',
 consumer_secret: 'h8M9mxzgZxFWoTGZZlaQruXbYcaDT5xE6evasOU9T2GPQbFiwF',
 access_token_key: '16349436-UM7CvwXepFwb1HGszzCxq90JptInDQ8hMZR2HpNfS',
 access_token_secret: 'cP4XMbe3Y2tvlhixLXdfrGge5SZ8o7WdGRZKw51YWcYUU'
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
  client.stream('statuses/filter', {locations: '-122.41, 47.54, -122.24, 47.70'}, function(stream) {
    console.log("Twitter stream has started...\n");


    var newTweet;
    stream.on('data', function(tweet) { //start twitter DATA
      //sanity check for incoming data
      console.log('searching for data...');
      if (tweet.geo && (tweet.text.toLowerCase().indexOf('#hire') < 0 ) && (tweet.text.toLowerCase().indexOf('#hiring') < 0 ) && (tweet.text.toLowerCase().indexOf('#job') < 0)) {

        newTweet = {
          curDate: new Date().toISOString(),
          text: tweet.text,
          latitute: tweet.geo.coordinates[1],
          longitude: tweet.geo.coordinates[0]
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
      col.find().toArray(function(err, result) {
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
