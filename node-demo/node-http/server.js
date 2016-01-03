var http = require("http");
var url = require("url");
var querystring = require("querystring");
var zlib = require("zlib");
http.createServer().on("request", function (req, res) {
    /* var body = [];
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
     })*/

    var data = 'I have a dream that one day this nation will rise up and live out the true meaning of its creed: "We hold these truths to be self-evident, that all men are created equal."I have a dream that one day on the red hills of Georgia, the sons of former slaves and the sons of former slave owners will be able to sit down together at the table of brotherhood. I have a dream that one day even the state of Mississippi, a state sweltering with the heat of injustice, sweltering with the heat of oppression, will be transformed into an oasis of freedom and justice. I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character. I have a dream today! I have a dream that one day, down in Alabama, with its vicious racists, with its governor having his lips dripping with the words of "interposition" and "nullification" -- one day right there in Alabama little black boys and black girls will be able to join hands with little white boys and white girls as sisters and brothers. I have a dream today! I have a dream that one day every valley shall be exalted, and every hill and mountain shall be made low, the rough places will be made plain, and the crooked places will be made straight; "and the glory of the Lord shall be revealed and all flesh shall see it together."2 This is our hope, and this is the faith that I go back to the South with. With this faith, we will be able to hew out of the mountain of despair a stone of hope. With this faith, we will be able to transform the jangling discords of our nation into a beautiful symphony of brotherhood. With this faith, we will be able to work together, to pray together, to struggle together, to go to jail together, to stand up for freedom together, knowing that we will be free one day.';
    if ((req.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
        zlib.gzip(data, function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Encoding': 'gzip'
            });
            res.end(data);
        });
    } else {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end(data);
    }
}).listen(8888);