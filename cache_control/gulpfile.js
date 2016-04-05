var gulp = require('gulp');
var debug = require('gulp-debug');
var gutil = require('gulp-util');
var uglify  = require("gulp-uglify");
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var del = require('del');
var fs = require("fs");
var path = require("path");
var upath = require("upath"); // 用于处理文件路径的跨平台

function travel(dir, callback) { // 遍历文件
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

gulp.task("clean", function(){ // 清理文件
    return del(["statics/**/*"])
});

gulp.task('js', function () {// 压缩JS
    gulp.src(['public/js/**/*.js'])
        .pipe(debug({title: 'gulp-debug:'}))
        .pipe(uglify().on('error', gutil.log)) // notice the error event here
        .pipe(rev())
        .pipe(gulp.dest('statics/js'))
        .pipe(rev.manifest({
            base:"/",
            merge: true // merge with the existing manifest (if one exists)
        }))
        .pipe(gulp.dest('/')); // write manifest to build dir
});

gulp.task('css', function () {// 压缩css
    gulp.src(['public/css/**/*.css'])
        .pipe(debug({title: 'gulp-debug:'}))
        .pipe(minifyCss().on('error', gutil.log)) // notice the error event here
        .pipe(rev())
        .pipe(gulp.dest('statics/css'))
        .pipe(rev.manifest({
            base:"/",
            merge: true // merge with the existing manifest (if one exists)
        }))
        .pipe(gulp.dest('/')); // write manifest to build dir
});

gulp.task('config', function(){
	
})
gulp.task('default', ['js', 'css']);

gulp.task('dev', function(){
    var manifest = {};
    var bath = ["public/css", "public/js"];
    for(var i = 0; i < bath.length; i ++) {
        travel(bath[i], function(pathname){
            pathname = upath.normalize(pathname).replace(/^public\/js\/|^public\/css\//, "");
            manifest[pathname] = pathname;
        })
    }
    fs.writeFile("dev-manifest.json", JSON.stringify(manifest, null, "\t"), function(err){
        if(err) throw err;
    });
});