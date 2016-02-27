var http = require("http");
var zlib = require("zlib");
var options = {
    host: "127.0.0.1",
    port: 8888,
    path: "/",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Accept-Encoding': 'gzip, deflate'
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
        if (res.headers["content-encoding"] == 'gzip') {
            data = Buffer.concat(data);
            console.log("解压前的数据（" + data.length + "）：" + data.toString());
            zlib.gunzip(data, function(err, unzipdata){
                console.log("解压后的数据（" + unzipdata.length + "）：" + unzipdata.toString());
                console.log("压缩率：" + (1 - data.length / unzipdata.length).toFixed(4) * 100 + "%");
            });
        } else {
             console.log(data.toString("hex"));
        }
    })
    
    // res.pipe(process.stdout);
});
request.write("name=liujia");
request.end();