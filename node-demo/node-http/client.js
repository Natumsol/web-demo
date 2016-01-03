var http = require("http");
var options = {
    host: "127.0.0.1",
    port: 8888,
    path: "/",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
};

/**
 * 在这里的res和server端的res是不一样的，这里的res性质类似于服务端的req.
 */
var request = http.request(options, function (res) {
    console.log("---------------响应---------------------");
    var data = [];
    res.on("data", function (chunk) {
        data.push(chunk);
    })
    res.on("end", function () {
        data = Buffer.concat(data);
        console.log(data.toString());
    })
    
    // res.pipe(process.stdout);
});
request.write("name=liujia");
request.end();