











webapp = require('./webapp');
var request = require('request');
var htmlparser = require("htmlparser2");
var visited = [];
var base, reff ;
var links =[];
var limit  ;       // concurrent read / upload limit
var running =0;

function getTags(url,callback) {
    var base = url;
    if (visited.indexOf(base) == -1) {
        webapp.logger('info').info(base);
        request['get'](base, function (e, data) {
            var url_this = base;
            if (!e) {
                var parser = new htmlparser.Parser({
                    onopentag: function (name, attribs) {
                        if (name === "a") {
                            if (attribs.hasOwnProperty("href")) {
                                attribs.href= attribs.href.trim();
                                if (attribs.href.match("^/") && visited.indexOf(reff + attribs.href) == -1){
                                    var newUrl = reff + attribs.href;
                                     links.push(newUrl);
                                }
                                else if (attribs.href.match("^" + reff) && visited.indexOf(attribs.href) == -1) {
                                    newUrl = attribs.href;
                                    links.push(newUrl);
                                    
                                 }
                                else {
                                    if (visited.indexOf(attribs.href) == -1 && !attribs.href.match("^/")  && !attribs.href.match("^"+reff)) {
                                        visited.push(attribs.href);
                                         webapp.logger('info').info(attribs.href);
                                    
                                    }
                                }
                                callback();
                               
                            }
                        }
                    },
                    ontext: function (text) {

                    }, onend: function () {
                     },
                    onclosetag: function (tagname) {
                        if (tagname === "a") {
                        }
                    }
                }, {decodeEntities: true});
                parser.write(data.body);
                parser.end();
            }
            else{
                   webapp.logger('error').info(e);
            }
        });
    }
}







function cralwer() {
    while(running < limit && links.length > 0) {
        var link= links.shift();
        getTags(link, function() {
            running--;
            if(links.length > 0){
            cralwer();
            }
          });
        
        running =running+1;
        
    }
}



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
    links.push(reff);
    cralwer();
})



