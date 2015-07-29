var mongo = require('mongodb');
var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var Twitter = require('twitter');

var client = new Twitter ({
  consumer_key: 'AOztrA5dsNyCNER0g89k0slQi',
  consumer_secret: 'kxmTIpyvgr9hJq1KkzFE9E2noVZ9VDALMz8qKFOudAJipBEEbW',
  access_token_key: '16349436-U5gvCtG0Qk23j5JeJOpXy4AJtSSp7xuDmuCinJKpq',
  access_token_secret: 'IQpkWFvNM8zB8x0Q2O82BJLTYzoqeMjCJUu3aN3HVEKny'
});

app.use(express.static(__dirname));
app.set('port', (process.env.PORT || 3000));

app.get('/', function(request, response) {
  response.send('ok');
});

mongo.connect('mongodb://127.0.0.1/27017', function(err, db) {
  if(err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB...\n');
  }

  var col = db.collection('tweets');

  io.on('connection', function(socket) {
    client.stream('statuses/filter', {locations: '-122.41, 47.54, -122.24, 47.70'}, function(stream) {
      console.log("Twitter stream has started...\n");

      stream.on('data', function(tweet) {
        if (tweet.geo) {
          var newTweet = {
            curDate: new Date().toISOString(),
            text: tweet.text,
            latitute: tweet.geo.coordinates[1],
            longitude: tweet.geo.coordinates[0]
          };
          col.insert(newTweet);
          io.emit('newTweet', newTweet);
          console.log(tweet.text);
        }
      });
    }); //end twitter stream

    col.find().toArray(function(error, result) {
      if(error) throw error;
      socket.emit('output', result);
    });
  }); //end socket connection
}); //end mongo connection

io.on('connection', function(socket) {
  console.log('A user has connected!\n');
});


http.listen(app.get('port'), function() {
  console.log('\nServer is now running on port ' + app.get('port') + '...\n');
});