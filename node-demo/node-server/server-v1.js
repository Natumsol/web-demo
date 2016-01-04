var fs = require('fs'),
    path = require('path'),
    http = require('http');

var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};

function combineFiles(pathnames, callback) {
    var body = [];
    (function next(i, length) {
        if (i < length) {
            console.log(pathnames[i]);
            fs.readFile(pathnames[i], function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    body.push(data);
                    next(i + 1, length);
                }
            });
        } else {
            callback(null, Buffer.concat(body));
        }
    })(0, pathnames.length);

}

function main(argv) {
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')), // 读取配置文件
        root = config.root || __dirname, // 静态资源根目录
        port = config.port || 80;

    http.createServer(function (req, res) {
        var urlInfo = parseURL(root, req.url);
        if(urlInfo) {
            combineFiles(urlInfo.pathnames, function (err, data) {
                if (err) {
                    res.writeHeader(500, { "Content-Type": "text/html" }),
                    res.end("<h1>Error</h1>")
                } else {
                    res.writeHeader(200, { "Content-Type": urlInfo.mime });
                    res.end(data.toString());
                }
            })
        } else {
             res.writeHeader(404, { "Content-Type": "text/html" }),
             res.end("<h1>404 Not Found</h1>")
        }
    }).listen(port);
}

function parseURL(root, url) {
    if(url.indexOf("??") !== -1) {
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