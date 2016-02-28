var child_process = require("child_process");
var child = child_process.spawn("node", ["child.js"]);
child.stdout.on("data", function(data){
    // data 为 Buffer数据类型
    console.log("--------------------子进程传送过来的数据---------------------\n");
    console.log(data.toString());
})