var ejs = require("ejs")
var fs = require('fs')
 var template = fs.readFileSync(__dirname + '/_layout/article.ejs', 'utf8');
var mongoose = require("mongoose");
require("./config/mongoose.js")();
var Zhihu = mongoose.model("Zhihu");
var async = require("async");

function render(zhihu, callback){
    var view = ejs.render(template,zhihu);
    fs.writeFile("dst/" + zhihu.question_title.replace(/[\/]/g, "\\") + ".html", view, function(err){
        callback(err);
    })
}

Zhihu.find({}).sort({data_time: 1}).exec(function(err, zhihus){
    if(err) throw err;
    else {
        async.map(zhihus, render, function(err){
            if(err) throw err;
            else {
                console.log("file generate ok!");
                process.exit(0);
            }
        });
    }
});
