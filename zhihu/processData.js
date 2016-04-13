var mongoose = require("mongoose");
require("./config/mongoose.js")();
var Zhihu = mongoose.model("Zhihu");
var async = require("async");
Zhihu.find({}, function(err, zhihus){
   console.log(zhihus.length);
   async.map(zhihus, function(item, callback){
       item.answer = item.answer.replace(/<span\s*class='\s*answer-date-link-wrap\s*'>.*<\/span>\s*$/g, "");
       item.save(function(err){
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