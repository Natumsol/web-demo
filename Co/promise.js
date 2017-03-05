/**
 * @description 模拟读取文件
 */
var file = {
    'file1.txt': "file2.txt",
    'file2.txt': 'Hello, Generator!'
};
function _readFile(filename, cb) {
    setTimeout(function () {
        cb(null, file[filename]);
    }, 100)
}
function _sleep(ms, cb) {
    setTimeout(function () {
        cb(null, "已经睡眠" + ms + "ms, time is up!");
    }, ms);
}
function _readFileSync(filename, cb) {
    cb(null, file[filename]);
}
/**
* 重写thunkify函数，使其能兼容同步任务
*/
function thunkify(fn) {
    return function () {
        var args = [].slice.call(arguments);
        var ctx = this;
        return function (done) {
            var called;
            args.push(function () {
                if (called)
                    return;
                called = true;
                done.apply(null, arguments);
            })
            try {
                fn.apply(ctx, args);
                // 将任务函数置后运行
            } catch (ex) {
                done(ex);
            }
        }
    }
}
function toPromise(fn) {
    return function () {
        var thunkify_fn = thunkify(fn).apply(this, arguments);
        return new Promise(function (resolve, reject) {
            thunkify_fn(function (err, data) {
                if (err)
                    reject(err);
                resolve(data);
            })
        }
        )
    }
}
function run(generator) {
    var gen = generator();
    function next(data) {
        var ret = gen.next(data);
        if (ret.done)
            return Promise.resolve("done");
        return Promise.resolve(ret.value).then(data => next(data)).catch(ex => gen.throw(ex));
    }
    try {
        return next();
    } catch (ex) {
        return Promise.reject(ex);
    }
}
var readFile = toPromise(_readFileSync);
var sleep = toPromise(_sleep);
function* flow() {
    var file1 = yield readFile("file1.txt");
    console.log('file1的内容是: ' + file1);
    console.log(yield sleep(2000))
    // sleep 1s
    var file2 = yield readFile(file1);
    console.log('file2的内容是: ' + file2);
}
run(flow);
