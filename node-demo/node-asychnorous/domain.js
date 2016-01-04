var http = require("http");
function async(request, callback) {
    // Do something.
    asyncA(request, function (data) {
        // Do something
        asyncB(request, function (data) {
            // Do something
            asyncC(request, function (data) {
                // Do something
                callback(data);
            });
        });
    });
}

http.createServer(function (request, response) {
    var d = domain.create();

    d.on('error', function () {
        response.writeHead(500);
        response.end();
    });

    d.run(function () {
        async(request, function (data) {
            response.writeHead(200);
            response.end(data);
        });
    });
});