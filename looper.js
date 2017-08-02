var fs = require('fs');

var walkPath = './photos';

var exists = function(albumName){
    return fs.stat('foo.txt', function(err, stat) {
        if(err == null) {
            console.log('File exists');

            return 'complete' || 'pending';
        } else if(err.code == 'ENOENT') {
            // file does not exist
            return false;
            // fs.writeFile('log.txt', 'Some log\n');
        } else {
            console.log('Some other error: ', err.code);
        }
    });
}

var walk = function (dir, done) {
    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }

        var i = 0;

        (function next () {
            var file = list[i++];

            if (!file) {
                return done(null);
            }
            
            file = dir + '/' + file;
            
            fs.stat(file, function (error, stat) {
        
                if (stat && stat.isDirectory()) {
                    // create album if there is no and save the id in a json
                    if(!exists(albumName)){
                        // create album and create a json
                    }else if('complete'){
                            // ignore it
                    }else if('pending'){
                            // continue the remaining pics
                    }

                    walk(file, function (error) {
                        next();
                    });
                } else {
                    // extract name and album and upload photo to it
                    //save to log file 
                    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
                        if (err){
                            console.log(err);
                        } else {
                        obj = JSON.parse(data); //now it an object
                        obj.table.push({id: 2, square:3}); //add some data
                        json = JSON.stringify(obj); //convert it back to json
                        fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
                    }});

                    console.log(file);
                    next();
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