'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');


function task() {
  return gulp.src('app/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
}
 
module.exports = task;
