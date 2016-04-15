var gulp = require('gulp');
var task = require("./task");
var exec = require('child_process').exec;
var fs = require("fs");
var async = require("async");
var path = require("path");
gulp.task("md", function () {
    task.generateMd();
})
gulp.task("clean", function () {
    task.clean();
})
gulp.task("init", function () {
    task.init();
})

gulp.task("generate", function () {
    var tasks = [];
    fs.readdir("dst/", function (err, files) {
        async.map(files, function (file, callback) {
            if (!fs.statSync("dst/" + file).isDirectory() && file.match(/^book\d{2}\.md$/)) {
                var numCount = file.match(/^book(\d{2})\.md$/)[1];
                tasks.push("pandoc -S -o book" + numCount +
                    ".epub --epub-cover-image=" + './cover/cover.png ' + " title" + numCount + ".conf " + "book" + numCount + ".md");
            }
            callback(null);
        }, function (err) {
            if (err) throw err;
            else {
                fs.writeFile("dst/make.bat", tasks.join("\n"), function (err) {
                    if (err) throw err;
                    else {
                        exec("./dst/make.bat", {cwd: path.resolve(process.cwd(), "/dst")},function(err, stdout, stderr){
                            if(err) throw err;
                            console.log(stdout);
                            console.log(stderr);
                        })
                    }
                })
            }
        });

    })
}); 