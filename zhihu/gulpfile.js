var gulp = require('gulp');
var task = require("./task");
gulp.task("md", function(){
    task.renderMd();
})
gulp.task("clean", function(){
    task.clean();
})