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
    var authURL = picasa.getAuthURL(config)
    if(authURL){
        console.log(authURL);
        res.send(authURL);
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

    res.send('access:'+ accessToken +"<br>"+'refresh'+refreshToken);

    })

});
app.get('/albums', function(req, res) {
    var options = {}

    picasa.getAlbums(access, options,  (error, albums) => {
    // console.log(error, albums);
    res.send(albums);
    })


});


app.get('/upload', function(req, res) {
    var  albumId = '5796511539998971217'

    fs.readFile(__dirname + '/photos/album1/IMG_4459.JPG', (err, binary) => {
    const photoData = {
        title       : 'zeinab-title',
        summary     : 'zeinab-summary',
        contentType : 'image/jpeg',
        binary      : binary
    }

    picasa.postPhoto(access, albumId, photoData, (error, response) => {
        console.log(error, response)
    })
    })


});

