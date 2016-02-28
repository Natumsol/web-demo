var http = require("http");
var url = require("url");
var chalk = require('chalk');
var requestListener = function (req, res) {
    var u = url.parse(req.url);
    var options = {
        hostname: u.hostname,
        port: u.port || 80,
        path: u.path,
        method: req.method,
        headers: req.headers
    };
    console.log(req.headers);
    console.log(chalk.blue(req.method + ": ") + u.hostname + u.path + "\n");

    var proxy = http.request(options, function (pRes) {
        console.log(chalk.magenta("RECEIVE: ") + u.hostname + u.path + "\n");
        res.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(res);
    }).on('error', function () {
        res.end();
    })

    req.pipe(proxy);// req为一个只读流，proxy为一个只写流，数据的流向为 只读流 -> 只写流
    // proxy.write("");
    // proxy.end();
}

http.createServer().on("request",requestListener).listen(8888, "0.0.0.0");

/*  
    http.createServer(callback) 等效于
    http.createServer().on("request", callback);
*/