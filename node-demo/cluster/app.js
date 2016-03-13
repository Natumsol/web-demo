var cluster = require("cluster");
var http = require("http");
var numCPUs = require("os").cpus().length;

if(cluster.isMaster) {
	console.log("Master start~");
	
	for(var i = 0; i < numCPUs; i ++) {
		cluster.fork();
	}
	
	cluster.on("listening", function(worker, address){
		console.log("listening worker:" + worker.process.pid + ", Address: " + address.address + ": " + address.port);
	});
	
	cluster.on("exit", function(worker, code, singal){
		console.log("workder: " + worker.process.pid + " died.");
	});
	
} else {
	http.createServer(function(req, res){
		res.writeHead("200");
		res.end("Hello, Cluster!");
	}).listen(8088);
}