var fs = require('fs'),
    path = require('path'),
    http = require('http');
var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};


function validateFiles(pathnames, callback) {
    (function next(i, length) {
        if (i < length) {
            fs.stat(pathnames[i], function (err, stat) {
                if (err) callback(err);
                else if (!stat.isFile()) {
                    callback(new Error());
                } else {
                    next(i + 1, length);
                }
            });
        } else {
            callback(null, pathnames);
        }
    })(0, pathnames.length);
}
function outputFiles(pathnames, writeStream) {
    var next = function (i, length) {
        if (i < length) {
            var rs = fs.createReadStream(pathnames[i]);
            rs.pipe(writeStream, { end: false });
            rs.on("end", function () {
                next(i + 1, length);
            })
        } else {
            writeStream.end();
        }
    }
    next(0, pathnames.length);
}
function main(argv) {
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')), // 读取配置文件
        root = config.root || __dirname, // 静态资源根目录
        port = config.port || 80,
        server;

    server = http.createServer(function (req, res) {
        var urlInfo = parseURL(root, req.url);
        if (urlInfo) {
            validateFiles(urlInfo.pathnames, function (err, pathnames) {
                if (err) {
                    res.writeHeader(500, { "Content-Type": "text/html" });
                    res.end(err.message);
                } else {
                    res.writeHeader(200, { "Content-Type": MIME[urlInfo.mime] });
                    outputFiles(pathnames, res);
                }
            });
        } else {
            res.writeHeader(404, { "Content-Type": "text/html" }),
            res.end("<h1>404 Not Found</h1>")
        }
    }).listen(port);
    process.on('SIGTERM', function(){
        server.close(function(){
            console.log("server-v2.js exited!!");
            process.exit(0);
        })
    })
}

function parseURL(root, url) {
    if (url.indexOf("??") !== -1) {
        var base, pathnames, parts;
        parts = unescape(url).split("??");
        base = parts[0];
        pathnames = parts[1].split(",").map(function (value, index, array) {
            return path.join(root, base, value);
        });
        console.log(pathnames)
        return {
            mime: MIME[path.extname(pathnames[0])] || "text/plain",
            pathnames: pathnames
        }
    } else {
        return null;
    }
}

main(process.argv.slice(2));
