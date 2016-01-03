var http = require("http");
var url = require("url");
var querystring = require("querystring");
http.createServer().on("request", function (req, res) {
    var body = [];
    req.on("data", function (chunk) {
        body.push(chunk);
    });
    req.on("end", function (chuck) {
        body = Buffer.concat(body);
        if (req.headers['content-type'] === "application/x-www-form-urlencoded") {
            body = querystring.parse(body.toString());
            console.log(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(body));
        } else {
            res.writeHead(200, {
                "Content-Type": req.headers['content-type'],
                "Content-Length": body.length
            });
            console.log(body);
            res.end(body);
        }
    })
}).listen(8888);