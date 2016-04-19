var gulp = require('gulp');
var task = require("./task");
var exec = require('child_process').exec;
var fs = require("fs");
var async = require("async");
var path = require("path");
var colors = require("colors");
var gulpsync = require('gulp-sync')(gulp);
gulp.task("md", function () {
    task.generateMd();
})
gulp.task("clean", function () {
    task.clean();
})
gulp.task("default", function () {
    task.init();
})

