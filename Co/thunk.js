var fs = require("fs");
var helper = function (fn) {
  return function () {
    var args = [].slice.call(arguments);
    var pass;
    args.push(function () { // 在回调函数中植入收集逻辑
      console.log("cb called!");
      if (pass) { // fn一定要是一个异步任务才行，不然控制逻辑无法传过来，generartor执行一次就会被暂停。
        pass.apply(null, arguments);
      }
    });
    fn.apply(null, args);

    return function (fn) { // 传入一个收集函数（返回一个闭包， 用来传入回调函数，作用有二，1.传出异步执行的数据。2. 控制generator继续向下执行。
      pass = fn; // 通过next().value(fn)来传入,控制闭包里面的内容
    };
  };
};
function thunkify(fn) {
  // assert('function' == typeof fn, 'function required');

  return function () {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};

/**
 * 基于thunk函数的执行器
 */
function run(flow) {
  var gen = flow();
  function next(data) {
    var ret = gen.next(data);
    if (ret.done) return;
    ret.value(function (err, data) {
      if (err) throw err;
      next(data);
    });
  }
  next(); // start
}

function _sleep(ms, fn) { // 注意参数的顺序
  setTimeout(fn, ms);
}
 
function mockReadFile(filename, fn) {
  setTimeout(function(){
  fn(null, filename);
  }, 1000);
}

var sleep = thunkify(_sleep);
var readFile = thunkify(mockReadFile);

var flow = function* () {
  console.log("before readfile 1.json")
  var txt = yield readFile('1.json');
  console.log(txt);
  console.log("after readfile 1.json");
};

run(flow);