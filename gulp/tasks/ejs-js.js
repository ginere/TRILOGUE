'use strict';

var config = require('../config');

var gulp = require('gulp');
var gutil = require('gulp-util');
var ejs = require("gulp-ejs");
var gulpif       = require('gulp-if');


var handleErrors = require('../util/handleErrors');
var htmlclean=require('htmlclean');

//var meta = require(config.meta);

function fontsGulp() {

	return gulp.src("app/ejs/js/**/*.js")
		.pipe(ejs({
			config:config,
			meta:require(config.metaPath),
			DEBUG:config.DEBUG,
			htmlclean:htmlclean
		})
	    .on('error', handleErrors))
		.pipe(gulp.dest("app/js/"));

}

module.exports = fontsGulp;
