var mongoose = require("mongoose");
require("./config/mongoose.js")();
var Zhihu = mongoose.model("Zhihu");
var async = require("async");
var count = 0;
Zhihu.find({/*_id: "570caebaa1c633d16ba46117"*/}, function(err, zhihus){
   console.log(zhihus.length);
   async.map(zhihus, function(item, callback){
       item.answer = item.answer.replace(/"/g, "'");
       console.log(item.answer);
       item.save(function(err){
           console.log(++count);
           callback(err);
       });
   }, function(err, results){
       if(!err) {
           console.log("modify successfully!");
           process.exit(0);
       }
       else throw err;
   });
})