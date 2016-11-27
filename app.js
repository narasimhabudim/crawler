webapp = require('./webapp');
var request = require('request');
var htmlparser = require("htmlparser2");
var visited = [];
var base, reff ;
var limit
function getTags(url) {
    var base = url;
    if (visited.indexOf(base) == -1 && !base.match("^https://www.vtiger.com/blog")) {
        visited.push(base);
        webapp.logger('info').info(base);
        request['get'](base, function (e, data) {
            if (!e) {
                var parser = new htmlparser.Parser({
                 onopentag: function (name, attribs) {
                        if (name === "a") {
                            if (attribs.hasOwnProperty("href")) {
                                if (attribs.href.match("^/") && visited.indexOf(reff + attribs.href) == -1){
                                    var newUrl = reff + attribs.href;
                                     q.push(newUrl, function (err) {
                                        if (!err) {
                                        }
                                        else
                                           webapp.logger('error').info(e);
                                    });
                                }
                                else if (attribs.href.match("^" + reff) && visited.indexOf(attribs.href) == -1) {
                                    newUrl = attribs.href;
                                    q.push(newUrl, function (err) {
                                        if (!err) {
                                           
                                        }
                                        else
                                           webapp.logger('error').info(e);
                                    });
                                }
                                else {
                                    if (visited.indexOf(attribs.href) == -1 && !attribs.href.match("^/")) {
                                        visited.push(attribs.href);
                                        webapp.logger('info').info(attribs.href);
                                    }
                                }
                            }
                        }
                    },
                    
                    ontext: function (text) {

                    }, 
                    onend: function () {
                        //end of  page  parsing can fire an event 
                        
                    },
                    
                    onclosetag: function (tagname) {
                        //event at recoverting a tag
                    }
                }, {decodeEntities: true});
                parser.write(data.body);
                parser.end();
            }
            else{
                console.log(e);
        }
        });
    }
}




var async = require('async');
var q = async.queue(function (url, callback) {
    getTags(url);
    callback();
}, limit);

q.drain = function () {

};


console.log ('enter site name to crawl and limit as space seperated values ');
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (data) {
       var input = data.split(" ");
        if((typeof input[1] != 'undefined') &&typeof input[0] != 'undefined' ){
          process.stdin.emit("end",input)          
        }
        else {
            console.log("enter proper input ")
        }
           
              
});

process.stdin.on('end',function(data){
    reff = data[0];
    base = data[0];
    limit =data[1];
    q.push(reff, function (err) {
  //start point exec 
});
    
})








