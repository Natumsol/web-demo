var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var http = require("http");
var querystring = require("querystring");

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use("/highlighter", function (req, res) {
    var params = {

    };
    var mode = req.method == "POST" ? "body" : "query";
    params.language = req[mode].language;
    params.theme = req[mode].theme;
    params.source = req[mode].source;

    var postData = querystring.stringify(params);

    var options = {
        hostname: 'markup.su',
        port: 80,
        path: '/api/highlighter',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };
    var request = http.request(options, (response) => {
        res.type('html');
        response.pipe(res);
    });

    request.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    request.write(postData);
    request.end();
})
app.listen(4000)