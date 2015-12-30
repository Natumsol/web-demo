var http = require("http");
var url = require("url");

var requestListener = function (req, res) {
    var u = url.parse(req.url);
    var options = {
        hostname: u.hostname,
        port: u.port || 80,
        path: u.path,
        method : req.method,
        headers: req.headers
    };
    
    console.log(req.method + ":" + u.hostname + u.path + "\n");
    
    var proxy = http.request(options, function(pRes){
        
        console.log("RECEIVE:" + u.hostname + u.path + "\n");
        res.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(res);
        res.write(";");
    }).on('error', function(){
        res.end();
    })
    
    // req.pipe(proxy);// 
    proxy.write("");
    proxy.end();
}

http.createServer(requestListener).listen(8888,"0.0.0.0");