var fs = require('fs');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));





var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('\nServer is now running on port ' + port + '...\n');
});
