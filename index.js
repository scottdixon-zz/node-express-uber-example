var Uber = require('node-uber');
var express = require('express');
var app = express();

var options = {
  sandbox: true,
  client_id: '...',
  client_secret: '...',
  server_token: '...',
  redirect_uri: 'http://localhost:3000/callback'
}

var uber = new Uber(options);

app.get('/', function (req, res) {
  // Kick off the authentication process
  var scope = ['request'];
  res.redirect(uber.getAuthorizeUrl(scope, 'http://localhost:3000/callback'));
});

app.get('/callback', function (req, res) {
  uber.authorization ({grantType: 'authorization_code', authorization_code: req.query.code}, function (err, access_token) {
    // Now we've got an access token we can use to book rides.
    // Access tokens expires in 30 days at whichpoint you can refresh.
    // You should save this token
    // More info: https://developer.uber.com/docs/authentication
    uber.access_token = access_token;
    res.send('Got an access token! Head to /book to initiate an ride request.');
  });
});

app.get('/book', function (req, res) {
  var rideDetails = {
    start_latitude: 123,
    start_longitude: 123,
    product_id: "a1111c8c-c720-46c3-8534-2fcdd730040d" // SF Uber X
  };
  
  uber.requests.requestRide(rideDetails, function (err, result) {
    if (err) {
      // Failed
      console.log(err);
    } else{
      res.send("An Uber is on the way!");
    }
  })
})

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
