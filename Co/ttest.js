	var fs = require("fs");
	var helper = function(fn) {
		return function() {
			var args = [].slice.call(arguments);
			var pass;
			args.push(function() { // 在回调函数中植入收集逻辑
				console.log("cb called!");
				if (pass) {
					pass.apply(null, arguments);
				}
			});
			fn.apply(null, args);
			// 传入一个收集函数（返回一个闭包， 用来传入回调函数，作用有二，1.传出异步执行的数据。2. 控制generator继续向下执行。
			return function(fn) {
				// 通过next().value(fn)来传入,控制闭包里面的内容
				pass = fn;
			};
		};
	};

	var co = function(flow) {
		var generator = flow();
		var next = function(data) {
			var result = generator.next(data);
			if (!result.done) {
				result.value(function(err, data) {
					if (err) {
						throw err;
					}
					next(data);
				});
			}
		};
		next(); //启动时不需要传递参数。
	};

	function _sleep(ms, fn) { // 注意参数的顺序
		setTimeout(fn, ms);
	}

	var sleep = helper(_sleep);
	var readFile = helper(fs.readFile);

	var flow = function*() {
		console.log("before readfile 1.json")
		var txt = JSON.parse(yield readFile('1.json', 'utf8'));
		console.log("after readfile 1.json");
		console.log("before sleep 1000 ms");
		yield sleep(1000);
		console.log("after sleep 1000 ms");
		console.log("before readfile " + txt.nextFile)
		var txt2 = yield readFile(txt.nextFile, 'utf8');
		console.log("after readFile " + txt.nextFile);
	};

	run(flow);


	function run(flow) {
		var gen = flow();

		function next(data) {
			var ret = gen.next(data);
			if (ret.done) return;
			ret.value(function(err, data) {
				if (err) throw err;
				next(data)
			});
		}
		next(); // start
	}