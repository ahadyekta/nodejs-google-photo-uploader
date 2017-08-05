var fs = require('fs');

fs.writeFile("/home/ahad/projects/photo-backup/" + Math.random(), "my node", function(err) {
if(err) {
return console.log(err);
}
console.log("The file was saved!");
}); 


var Picasa = require('picasa')
var picasa = new Picasa();

 var dataConfig = fs.readFileSync(__dirname+'/config.json', 'utf8');
 var config = JSON.parse(dataConfig); //now it an object
console.log(config);


var options = {}

// var getAlbum = function(){
//     picasa.getAlbums(config.accessToken, options,  (error, albums) => {
//     console.log('dddddddd');
// // console.log(error, albums);
//     if(error.statusCode == 403){
//         console.log('refresh');
//         getAlbum();
//     }

//     });
// };
// getAlbum();  


var walkPath = config.imagePath;
var logPath = __dirname+'/logs/';

var readLog= function(albumName){
         
           var data = fs.readFileSync(logPath+albumName+'.txt', 'utf8');
           obj = JSON.parse(data); //now it an object
           return obj;
}
        var lastDir = null;
var walk = function (dir, done) {
    console.log('walk:',dir);
    fs.readdir(dir, function (error, list) {
        console.log("list:",list);
        if (error) {
            return done(error);
        }

        var i = 0;

        (function next () {
            var file = list[i++];
            console.log('next:',file);
            if (!file) {
                return done(null);
            }
            var fileName = file;
            file = dir + '/' + file;
            
            fs.stat(file, function (error, stat) {
        
                if (stat && stat.isDirectory()) {
                          //// start checking
                            try {
                            var stat = fs.statSync(logPath+list[i-1]+'.txt');
                            var obj =readLog(list[i-1]);
                             var existed = obj.status;
                            console.log('it exists');
                            }
                            catch(err) {
                                console.log('it does not exist');
                                var existed =false;
                                
                            }

                          //// end of checking
                     
                          console.log('existing for',list[i-1],' = ',existed);
                            if(existed != 'complete'){
                                if(!existed){
                                    console.log('Creating album with the name of '+list[i-1]);
                                         var obj = {
                                                status: 'pending',
                                                photos:[],
                                                name: list[i-1],
                                        };
                                        fs.writeFileSync(logPath+list[i-1]+".txt", JSON.stringify(obj));
                                        
                                        walk(file, function (error) {
                                            next();
                                        });
                                    
                                }else{ // for pending we just walk through it
                                    walk(file, function (error) {
                                        next();
                                        });
                                }

                            }else{
                                next();
                            }
                   
                } else {
                     console.log('up:',file);
                    // check there is not in json
                    // extract name and album and upload photo to it
                    //save to log file 
                    var logNameArray = file.split('/'); 
                    var albumName = logNameArray[((logNameArray.length)-2)];
                    var obj =readLog(albumName);
                    if(obj.photos.indexOf(list[i-1])<0){
                        

                        console.log('upload image with the name of '+list[i-1]+' in '+albumName); 
                        
                        //////////////////
                        
                        // var path = __dirname + "/photos/"+albumName+"/"+list[i-1];
                        console.log('path:',file);
                        fs.readFile(file, (err, binary) => {
                            var photoData = {
                                title       : list[i-1],
                                summary     : albumName,
                                contentType : 'image/jpeg',
                                binary      : binary
                            }
                           function postImage(){
                                picasa.postPhoto(config.accessToken, config.albumId, photoData, (error, response) => {
                                console.log('uploaded:',error, response);
                                if(error){
                                    if(error.statusCode == 403){
                                        //refresh the accessToken and try again
                                        console.log('refresh token');

                                        picasa.renewAccessToken(config, config.refreshToken, (error, accessToken) => {
                                            console.log('new ',error, accessToken);
                                            if(!error){
                                                config.accessToken =  accessToken;
                                                fs.writeFileSync(__dirname+"/config.json", JSON.stringify(config));
                                                
                                            }
                                            postImage();
                                        })
                                    }else{
                                        next();
                                    }
                                }else{
                                    var logNameArray = file.split('/'); 
                                    var albumName = logNameArray[((logNameArray.length)-2)];
                                    var obj =readLog(albumName);
                                    obj.photos.push(list[i-1]);
                                    if(i==list.length){
                                        obj.status = "complete";
                                    }
                                    fs.writeFileSync(logPath+albumName+".txt", JSON.stringify(obj));
                                    next();
                                }
                                                                
                                

                            })
                           }
                           postImage();
                            
                        })
                        //////////////////
                    }else{
                        next();
                    }
                }
            });
        })();
    });
};

// optional command line params
//      source for walk path
process.argv.forEach(function (val, index, array) {
    if (val.indexOf('source') !== -1) {
        walkPath = val.split('=')[1];
    }
});

console.log('-------------------------------------------------------------');
console.log('processing...');
console.log('-------------------------------------------------------------');

walk(walkPath, function(error) {
    if (error) {
        throw error;
    } else {
        console.log('-------------------------------------------------------------');
        console.log('finished.');
        console.log('-------------------------------------------------------------');
    }
});