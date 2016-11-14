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
var colors = require("colors");
var allImages = []; // all images in chapter
var os = require("os");

/* single html render function */
function renderHTMl(zhihu, callback) {
    var view = ejs.render(template, zhihu);
    fs.writeFile("dst/" + zhihu.question_title.replace(/[\/|?|"|<|>|\\|\|]/g, "") + ".html", view, function(err) {
        callback(err);
    })
}

/* single md chaper render function */
function renderChapter(zhihu, index, callback) {
    var view = ejs.render(chapter, zhihu);
    view = view.replace(/!\[\]\((.*?com\/(.*?\.jpg|jpeg|png|gif))\)/g, function(match, p1, p2, offset, string) {
        allImages.push({
            url: p1,
            filename: p2
        });
        return "![](images/" + p2 + ")";
    }).replace(/!\[\]\((\/\/.*?equation\?.*?)\)/g, "![](https:$1)");
    fs.writeFile("dst/Chapter" + (new Array((4 - index.toString().length)).join("0") + index) + ".md", view, function(err) {
        callback(err);
    })
}

function downloadAllImages(callback) {
    async.mapLimit(allImages, 10, function(image, callback) {
        if (fs.existsSync('dst/images/' + image.filename)) {
            logger.info(image.filename + " already exists, skipping...");
            callback(null);
        } else {
            logger.info("GET/ " + image.url);
            https.get(image.url, function(res) {
                var imageStream = fs.createWriteStream('dst/images/' + image.filename);
                res.pipe(imageStream);
                imageStream.on("finish", function() {
                    logger.info(image.url + " download successfully!");
                    callback(null);
                });
                imageStream.on("error", function(err) {
                    logger.error(err.toString());
                    callback(err);
                })
            })
        }

    }, function(err) {
        callback(err);
    })
}

/* generate all chapter */
function generateChapter(callback) {
    Zhihu.find({}).sort({
        data_time: 1
    }).exec(function(err, zhihus) {
        if (err) throw err;
        else {
            async.forEachOf(zhihus, renderChapter, function(err) {
                callback(err);
            });
        }
    });
}

/* generate html book */
function generateHTMLBook(callback) {
    Zhihu.find({}).sort({
        data_time: 1
    }).exec(function(err, zhihus) {
        if (err) throw err;
        else {
            var mybook = ejs.render(book, {
                zhihus: zhihus,
                title: "知乎电子书"
            });
            fs.writeFile("dst/" + "book.html", mybook, function(err) {
                callback(err);
            })
        }
    });
}

/* generate md book */
function generateMd(callback) {
    Zhihu.find({}).sort({
        data_time: 1
    }).exec(function(err, zhihus) {
        if (err) throw err;
        else {
            var renderTasks = [];
            for (var i = 0; i < zhihus.length; i += 30) {
                renderTasks.push(zhihus.slice(i, i + 30));
            }
            async.forEachOf(renderTasks, function(task, index, callback) {
                var mybook = ejs.render(md, {
                    zhihus: task
                });
                mybook = mybook.replace(/!\[\]\((.*?com\/(.*?\.jpg|jpeg|png|gif))\)/g, function(match, p1, p2, offset, string) {
                    allImages.push({
                        url: p1,
                        filename: p2
                    });
                    return "![](images/" + p2 + ")";
                }).replace(/!\[\]\((\/\/.*?equation\?.*?)\)/g, "![](https:$1)");

                fs.writeFile("dst/" + "book" + (new Array((3 - index.toString().length)).join("0") + index) + ".md", mybook, function(err) {
                    callback(err);
                })
                var mytitle = ejs.render(title, {
                    count: index + 1,
                    author: userInfo.username
                })
                fs.writeFile("dst/" + "title" + (new Array((3 - index.toString().length)).join("0") + index) + ".conf", mytitle, function(err) {
                    if (err) throw err;
                    else console.log("title" + (new Array((3 - index.toString().length)).join("0") + index) + ".conf save ok!");
                })
            }, function(err) {
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
    }).exec(function(err, zhihus) {
        if (err) throw err;
        else {
            async.map(zhihus, renderHTMl, function(err) {
                if (callback) callback(err);
                else {
                    console.log("html generate ok!");
                    process.exit(0);
                }
            });
        }
    });

}

function clean(callback) {
    fs.readdir("./dst", function(err, files) {
        if (err) throw err;
        else async.map(files, function(item, callback) {
            if (!fs.lstatSync("./dst/" + item).isDirectory()) {
                fs.unlink("./dst/" + item, function(err) {
                    callback(err);
                });
            } else {
                callback(null);
            }
        }, function(err) {
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
    async.series([clean, generateMd, downloadAllImages], function(err) {
        if (err) throw err;
        else {
            var tasks = [];
            if (os.type().toLowerCase() == "windows_nt") tasks.push('@echo off');
            fs.readdir("dst/", function(err, files) {
                async.map(files, function(file, callback) {
                    if (!fs.statSync("dst/" + file).isDirectory() && file.match(/^book\d{2}\.md$/)) {
                        var numCount = file.match(/^book(\d{2})\.md$/)[1];
                        tasks.push("\npandoc -S -o book" + numCount +
                            ".epub --epub-cover-image=" + './cover/cover.jpg ' + " title" + numCount + ".conf " + "book" + numCount + ".md");
                    }
                    callback(null);
                }, function(err) {
                    if (err) throw err;
                    else if (os.type().toLowerCase() == "windows_nt") {
                        tasks.push("for %%i in (*.md) do @del %%i");
                        tasks.push("for %%i in (*.conf) do @del %%i")
                        tasks.push("echo 'done!!'");
                        tasks.push("pause");
                        fs.writeFile("dst/make.bat", tasks.join("\n"), function(err) {
                            if (err) throw err;
                            else {
                                console.log(colors.green("电子书生成脚本已经生成，请打在./dst目录下双击make.bat即可生成epub格式的电子书"));
                                process.exit(0);
                            }
                        })
                    } else {
                        fs.writeFile("dst/make.sh",tasks.join("\n"), function(err) {
                             if (err) throw err;
                            else {
                                console.log("finsih!");
                                process.exit(0);
                            }
                        })
                    }
                });

            })
        }
    });
}

module.exports = {
    init: init,
    clean: clean,
    generateMd: generateMd,
    generateHTML: generateHTML
}