var child_process = require("child_process");
var worker;

function spawn(server, config) {
    worker = child_process.spawn("node", [server, config]);
    worker.on("exit", function(code){
        if(code !== 0) {
            spawn(server, code);
        }
    });
}

function main(argv){
    spawn('server-v2.js', argv[0]);
    process.on('SIGTERM', function(){
        worker.kill();
        process.exit(0);
    });
}

main(process.argv.slice(2));