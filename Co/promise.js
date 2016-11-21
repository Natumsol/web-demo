var fs = require("fs");
function promiseify(fn) { // make a regular 
    return function () {
        var args = [].slice.call(arguments);
        return new Promise((resolve, reject) => {

            args.push(function (err, data) {
                if (err) reject(err);
                resolve(data);
            })

            fn.apply(this, args);

        });
    }

}

/**
 * 基于Promise的执行器
 */

function runPromise(flow) {
    var gen = flow();
    function next(data) {
        var ret = gen.next(data);
        if (ret.done) return Promise.resolve("done");
        ret.value.then(data => {
            next(data)
        }).catch(err => {
            gen.throw(err);
        })
    }
    next();
}


function _sleep(ms, fn) { // 注意参数的顺序
    setTimeout(fn, ms);
}

function mockReadFile(filename, fn) {
    setTimeout(function () {
        fn(null, filename);
    }, 1000);
}

function _echo(text, fn) {
    setTimeout(function(){
        console.log(text);
        fn(null, text);
    }, 2000)
}


var sleep = promiseify(_sleep);
var readFile = promiseify(mockReadFile);
var echo = promiseify(_echo);

function sync(text) {
    return Promise.resolve(text);
}

var flow = function* () {
    var text = yield sync("西部世界");
    console.log(text);
    console.log("sleep 5000ms ...");
    yield sleep(1000);
    console.log("wake up ...");
    console.log("before readfile 1.json")
    var txt = yield readFile('1.json');
    console.log(txt);
    console.log("after readfile 1.json");
};

runPromise(flow);



