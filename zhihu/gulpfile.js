var gulp = require('gulp');
var task = require("./task");
gulp.task("md", function(){
    task.generateMd();
})
gulp.task("clean", function(){
    task.clean();
})
gulp.task("init", function(){
    task.init();
})