var mongoose = require("mongoose"),
	config = require("./config.js");
module.exports = function(){
	console.log(config);
	var db = mongoose.connect(config.db, function(err){
		if(err) {
			throw err;
		} else {
			// console.log("数据库连接成功！");
		}
	});

	require("../model/zhihu.model.js");
	return db;
};
