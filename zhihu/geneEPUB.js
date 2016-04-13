var Epub = require("epub-gen")
var mongoose = require("mongoose");
require("./config/mongoose.js")();
var Zhihu = mongoose.model("Zhihu");
var async = require("async");
var options = {
    title: "知乎电子书",
    author: "刘甲",
    cover: "http://jiasuhuicdn.b0.upaiyun.com/wp-content/uploads/2015/11/105654j2a8hwnlzw552tzl.png",
    output: "./zhihu.epub",
    content: []
}
Zhihu.find({}).limit(10).exec(function(err, zhihus) {
    console.log(zhihus.length);
    async.map(zhihus, function(item, callback) {
        options.content.push({
            title: item.question_title, // Optional
            author: item.author, // Optional
            data: item.answer
        });
        callback(null);
    }, function(err, results) {
        if (!err) {
            new Epub(options);
        }
        else throw err;
    });
})
