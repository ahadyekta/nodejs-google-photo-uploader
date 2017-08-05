var express = require('express');
var path = require('path');
var Picasa = require('picasa')
var fs = require('fs')

var picasa = new Picasa();

var app = express();


app.set('port', 4000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

 var dataConfig = fs.readFileSync('./config.json', 'utf8');
 var config = JSON.parse(dataConfig); //now it an object


app.get('/', function(req, res) {
    var authURL = picasa.getAuthURL(config);
    if(authURL){
        res.redirect(authURL);
    }else{
        res.send('there is an unknown error');
    }

});

app.get('/callback', function(req, res) {
   console.log('code is:',req.query);
   var code = req.query.code;
   picasa.getAccessToken(config, code, (error, accessToken, refreshToken) => {
    console.log('access:', accessToken );
    console.log('refresh',refreshToken);

     config.accessToken =    accessToken;
     if(refreshToken){
        config.refreshToken = refreshToken;
     }

     fs.writeFileSync("./config.json", JSON.stringify(config));

    res.send('config file was edited with this data: <br> accessToken:'+ accessToken +"<br>"+'refreshToken'+refreshToken+'<br> Now run "node looper" in terminal to upload');

    })

});

app.get('/albums', function(req, res) {
    var options = {}

    picasa.getAlbums(access, options,  (error, albums) => {
    // console.log(error, albums);
    res.send(albums);
    })


});