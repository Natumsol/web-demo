var ejs = require("ejs")
var fs = require('fs')
var template = fs.readFileSync(__dirname + '/_layout/article.ejs', 'utf8');
var book = fs.readFileSync(__dirname + '/_layout/book.ejs', 'utf8');
var mongoose = require("mongoose");
require("./config/mongoose.js")();
var Zhihu = mongoose.model("Zhihu");
var async = require("async");
function render(zhihu, callback) {
    var view = ejs.render(template, zhihu);
    fs.writeFile("dst/" + zhihu.question_title.replace(/[\/]/g, "\\") + ".html", view, function(err) {
        callback(err);
    })
}

function renderBook(callback) {
    Zhihu.find({}).sort({ data_time: 1 }).exec(function(err, zhihus) {
        if (err) throw err;
        else {
            var mybook = ejs.render(book, { zhihus: zhihus, title: "知乎电子书" });
            fs.writeFile("dst/" + "book.html", mybook, function(err) {
                callback(err);
            })
        }
    });
}

function renderHTML(callback) {
    Zhihu.find({}).sort({ data_time: 1 }).exec(function(err, zhihus) {
        if (err) throw err;
        else {
            async.map(zhihus, render, function(err) {
                callback(err);
            });
        }
    });

}

function generate() {
    async.parallel([renderBook, renderHTML], function(err) {
        if (err) throw err;
        else {
            console.log("file generate ok!");
            process.exit(0);
        }
    });
}
generate();