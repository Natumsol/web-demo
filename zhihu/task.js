var ejs = require("ejs")
var fs = require('fs')
var template = fs.readFileSync(__dirname + '/_layout/article.ejs', 'utf8');
var book = fs.readFileSync(__dirname + '/_layout/book.ejs', 'utf8');
var md = fs.readFileSync(__dirname + '/_layout/md.ejs', 'utf8');
var chapter = fs.readFileSync(__dirname + '/_layout/chapter.ejs', 'utf8');
var title = fs.readFileSync(__dirname + '/_layout/title.ejs', 'utf8');
var mongoose = require("mongoose");
require("./config/mongoose.js")();
var Zhihu = mongoose.model("Zhihu");
var async = require("async");
var https = require("https");
var logger = require("./log");
var userInfo = require("./config/userInfo.json");

var allImages = []; // all images in chapter

/* single html render function */
function renderHTMl(zhihu, callback) {
    var view = ejs.render(template, zhihu);
    fs.writeFile("dst/" + zhihu.question_title.replace(/[\/|?|"|<|>|\\|\|]/g, "") + ".html", view, function (err) {
        callback(err);
    })
}

/* single md chaper render function */
function renderChapter(zhihu, index, callback) {
    var view = ejs.render(chapter, zhihu);
    view = view.replace(/!\[\]\((.*?com\/(.*?\.jpg|jpeg|png|gif))\)/g, function (match, p1, p2, offset, string) {
        allImages.push({
            url: p1,
            filename: p2
        });
        return "![](images/" + p2 + ")";
    }).replace(/!\[\]\((\/\/.*?equation\?.*?)\)/g, "![](https:$1)");
    fs.writeFile("dst/Chapter" + (new Array((4 - index.toString().length)).join("0") + index) + ".md", view, function (err) {
        callback(err);
    })
}

function downloadAllImages(callback) {
    async.mapLimit(allImages, 10, function (image, callback) {
        logger.info("GET/ " + image.url);
        https.get(image.url, function (res) {
            var imageStream = fs.createWriteStream('dst/images/' + image.filename);
            res.pipe(imageStream);
            imageStream.on("finish", function () {
                logger.info(image.url + " download successfully!");
                callback(null);
            });
            imageStream.on("error", function (err) {
                logger.error(err.toString());
                callback(err);
            })
        })
    }, function (err) {
        callback(err);
    })
}

/* generate all chapter */
function generateChapter(callback) {
    Zhihu.find({}).sort({
        data_time: 1
    }).exec(function (err, zhihus) {
        if (err) throw err;
        else {
            async.forEachOf(zhihus, renderChapter, function (err) {
                callback(err);
            });
        }
    });
}

/* generate html book */
function generateHTMLBook(callback) {
    Zhihu.find({}).sort({
        data_time: 1
    }).exec(function (err, zhihus) {
        if (err) throw err;
        else {
            var mybook = ejs.render(book, {
                zhihus: zhihus,
                title: "知乎电子书"
            });
            fs.writeFile("dst/" + "book.html", mybook, function (err) {
                callback(err);
            })
        }
    });
}

/* generate md book */
function generateMd(callback) {
    Zhihu.find({}).sort({
        data_time: 1
    }).exec(function (err, zhihus) {
        if (err) throw err;
        else {
            var renderTasks = [];
            for (var i = 0; i < zhihus.length; i += 50) {
                renderTasks.push(zhihus.slice(i, i + 50));
            }
            async.forEachOf(renderTasks, function (task, index, callback) {
                var mybook = ejs.render(md, {
                    zhihus: task
                });
                mybook = mybook.replace(/!\[\]\((.*?com\/(.*?\.jpg|jpeg|png|gif))\)/g, function (match, p1, p2, offset, string) {
                    allImages.push({
                        url: p1,
                        filename: p2
                    });
                    return "![](images/" + p2 + ")";
                }).replace(/!\[\]\((\/\/.*?equation\?.*?)\)/g, "![](https:$1)");

                fs.writeFile("dst/" + "book" + (new Array((3 - index.toString().length)).join("0") + index) + ".md", mybook, function (err) {
                    callback(err);
                })
                var mytitle = ejs.render(title, {
                    count: index + 1,
                    author: userInfo.username
                })
                fs.writeFile("dst/" + "title" + (new Array((3 - index.toString().length)).join("0") + index) + ".conf", mytitle, function (err) {
                    if (err) throw err;
                    else console.log("title" + (new Array((3 - index.toString().length)).join("0") + index) + ".conf save ok!");
                })
            }, function (err) {
                if (callback) callback(err);
                else {
                    if (err) throw err;
                    else {
                        console.log("generate md ok!");
                        process.exit(0);
                    }
                }
            })

        }
    });
}

/* generate all html */
function generateHTML(callback) {
    Zhihu.find({}).sort({
        data_time: 1
    }).exec(function (err, zhihus) {
        if (err) throw err;
        else {
            async.map(zhihus, renderHTMl, function (err) {
                callback(err);
            });
        }
    });

}

function clean(callback) {
    fs.readdir("./dst", function (err, files) {
        if (err) throw err;
        else async.map(files, function (item, callback) {
            if (!fs.lstatSync("./dst/" + item).isDirectory()) {
                fs.unlink("./dst/" + item, function (err) {
                    callback(err);
                });
            }
        }, function (err) {
            if (callback) callback(err);
            else {
                if (err) throw err;
                else {
                    console.log("clean ok!");
                    process.exit(0);
                }
            }
        });
    })
}

function init() {
    async.series([generateMd, downloadAllImages], function (err) {
        if (err) throw err;
        else {
            console.log("file generate ok!");
            process.exit(0);
        }
    });
}

module.exports = {
    init: init,
    clean: clean,
    generateMd: generateMd
}