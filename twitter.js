var mongo = require('mongodb');
var express = require('express');
var app = express();
<<<<<<< HEAD

=======
>>>>>>> f1326393a56d97c4cfe7329542315eb38ba88aa8
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

app.get('/', function(request, response) {
  response.send('ok');
});

mongo.connect('mongodb://127.0.0.1/27017', function(err, db) {
  if(err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB');
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





  client.stream('statuses/filter', {track: 'Seattle'}, function(stream) {

  var col = db.collection('tweets');

  client.stream('statuses/filter', {locations: '-122.41, 47.54, -122.24, 47.70'}, function(stream) {

    console.log("stream opened");



    stream.on('data', function(tweet) {
      if (tweet.geo) {
        col.insert({curDate: new Date().toISOString(), text: tweet.text, latitute: tweet.geo.coordinates[1],longitude: tweet.geo.coordinates[0]});
        console.log(tweet.text);
      }
    });


  });

  io.on('connection', function(socket) {

    var col = db.collection('tweets');

    col.find().toArray(function(error, result) {
      if(error) throw error;
      socket.emit('output', result);
    });

  });
});

io.on('connection', function(socket) {
  console.log('A user has connected!\n');
});


http.listen(app.get('port'), function() {
  console.log('\nServer is now running on port ' + app.get('port') + '...\n');
});
