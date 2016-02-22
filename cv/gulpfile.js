var gulp = require('gulp');
var compass = require('gulp-compass');
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task('compass', function() {
    gulp.src('./scss/**')
        .pipe(compass({
            comments: false,
            css: 'css',
            sass: 'scss',
            image: 'img'
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('vendor', function() {
    gulp.src(['./bower_components/pagepiling.js/jquery.pagepiling.min.js',
            './bower_components/pagepiling.js/jquery.pagepiling.css'])
        .pipe(gulp.dest('./vendor'));
});

gulp.task("js", function() {
    gulp.src("./js/index.js")
        .pipe(uglify())
        .pipe(rename("index.min.js"))
        .pipe(gulp.dest("./js"));
});

gulp.task('default', function() {
    gulp.run('compass');
    gulp.run('vendor');
    gulp.run("js");

    gulp.watch('./scss/**', function(event) {
        gulp.run('compass');
    });

    gulp.watch("./js/index.js", function(event){
        gulp.run("js");
    })
});
