'use strict';

// https://www.npmjs.com/package/vinyl-source-stream

var config = require('../config');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var pump = require('pump');
 
function task() {

	return pump([
        gulp.src('dist/js/bundle.js'),
        uglify(),
		rename({ suffix: '.min' }),
        gulp.dest('dist/js/')
    ]);	
}

module.exports = task;
