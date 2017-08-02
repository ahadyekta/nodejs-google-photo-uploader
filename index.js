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

    var config = {
     clientId     : "506758245884-96no3ods579omcjsommu5d64e2e3bhkr.apps.googleusercontent.com",
     clientSecret : "WTZWOGLRNdS0iTJNCEyWtaPA",
     redirectURI  : "http://localhost:4000/callback"
    }

    var access = 'ya29.GlubBBDMxtFZedjL2ploIepZYNXuSJbIhKHNu4Tg0MCOkmT5xy08uSRUlRZQXbnD9lrkaoEtznoiec6BwjAiXJtn_PRll8Z60jpMMB0IQX6ar-cpM6Tun7-EzfWy';
    var refresh = null;

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
    console.log('access:',error, accessToken, refreshToken);
    var options = {}

    picasa.getAlbums(accessToken, options,  (error, albums) => {
    console.log(error, albums)
    })

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

    fs.readFile(__dirname + '/photos/jake.jpg', (err, binary) => {
    const photoData = {
        title       : 'Jake the dog',
        summary     : 'Corgis ftw!',
        contentType : 'image/jpeg',
        binary      : binary
    }

    picasa.postPhoto(access, albumId, photoData, (error, response) => {
        console.log(error, response)
    })
    })


});

