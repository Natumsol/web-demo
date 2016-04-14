var gulp = require('gulp');
var task = require("./task");
var exec = require('child_process').exec;
var fs = require("fs");
var async = require("async");

gulp.task("md", function(){
    task.generateMd();
})
gulp.task("clean", function(){
    task.clean();
})
gulp.task("init", function(){
    task.init();
})

gulp.task("generate", function(){
    var task = [];
    
}); 