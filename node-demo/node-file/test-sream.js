var fs = require("fs");
var rs = fs.createReadStream("test.txt");
var ws = fs.createWriteStream("target.txt");
var counter = 0;
rs.on("data", function(chunk){
    console.log("---------------------------数据片段" + (++counter) + ": --------------------------------\n");
    console.log(chunk.length); //每个chunk为65536个字符
    ws.write(chunk.toString("hex"));
    if(counter > 10) rs.pause();
});

rs.on("end", function(){
    console.log("---------------------------数据传输结束！！-----------------------------");
})

