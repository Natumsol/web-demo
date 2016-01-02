var fs = require("fs")
var path = require("path")

/**
 * 打印目录树（同步）
 */
function travleSync(dir, deps){
    try {
        fs.readdirSync(dir).forEach(function(value, index, array){
            var pathname = path.join(dir, value)
            var tabs = (new Array(deps + 1)).join(" ");
            if(fs.statSync(pathname).isDirectory()) {
                console.log(tabs + "-" + pathname);
                travleSync(pathname, deps + 1)
            } else {
                console.log(tabs + "-" + value);
            }
        });
        
    } catch (error) {
    }
}

/**
 * 打印目录树（异步）
 * 异步打印存在目录与子目录不对应的情况
 */
function travle(dir, deps) {
    fs.readdir(dir, function(err, files){
        if(err){
            return;// 忽略错误
        }
        files.forEach(function(value){
            var pathname = path.join(dir, value);
            var tabs = (new Array(deps + 1)).join(" ");
            fs.stat(pathname, function(err, stat){
                if(err){
                    return;
                }
                if(stat.isDirectory()) {
                    console.log(tabs + "-" + pathname);
                    travle(pathname, deps + 1);
                } else {
                    console.log(tabs + "-" + value);
                   
                }
            })
        });
    });   
}
console.log("--------------同步打印------------------------\n");
travleSync("/home/qinglan/Desktop/underscore.js", 1);

console.log("--------------异步打印------------------------\n");
travle("/home/qinglan/Desktop/underscore.js", 1);


/**
 * 打印结果，可以很明显的看出他们之间的异同
 --------------同步打印------------------------

 -/home/qinglan/Desktop/underscore.js/dir
  -fakeUnderScore.js
  -/home/qinglan/Desktop/underscore.js/dir/hello
   -hello world.js
 -fakeUnderScore.js
 -index.html
 -/home/qinglan/Desktop/underscore.js/root
 -underscore.js
--------------异步打印------------------------

 -/home/qinglan/Desktop/underscore.js/dir
 -fakeUnderScore.js
 -index.html
 -/home/qinglan/Desktop/underscore.js/root
 -underscore.js
  -fakeUnderScore.js
  -/home/qinglan/Desktop/underscore.js/dir/hello
   -hello world.js
 
 */