var mongo = require('mongodb');
var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var Twitter = require('twitter');

var client = new Twitter ({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.use(express.static(__dirname + '/public'));
app.set('port', (process.env.PORT || 3000));

mongo.connect('mongodb://127.0.0.1/27017', function(err, db) {   //open mongo connection
  if(err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB...\n');
  }

  var col = db.collection('tweets');
  client.stream('statuses/filter', {locations: '-122.41, 47.54, -122.24, 47.70'}, function(stream) {  // open twitter connection
    console.log("Twitter stream has started...\n");

      stream.on('data', function(tweet) { //start twitter DATA
        //sanity check for incoming data
        console.log('two');
        if (tweet.geo) {

          var newTweet = {
            curDate: new Date().toISOString(),
            text: tweet.text,
            latitute: tweet.geo.coordinates[1],
            longitude: tweet.geo.coordinates[0]
          };

          col.insert(newTweet);  //save new tweet to db
          console.log(tweet.text);

          io.on('connection', function(socket) {  //open socket when user connects
            //sanity check for connection start
            console.log('A new user has connected!\n');
            io.emit('newTweet', newTweet); //send new tweet to front end

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
        }
      }); //end twitter DATA
  }); //end twitter stream
}); //end mongo connection

http.listen(app.get('port'), function() {
  console.log('\nServer is now running on port ' + app.get('port') + '...\n');
});