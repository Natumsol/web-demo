var fs = require("fs");
var http = require("http");

http.createServer(function(req, res){
   var stream = fs.createReadStream(__dirname + "/app.js");
   stream.pipe(res);
}).listen(8888);