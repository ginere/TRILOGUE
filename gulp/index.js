'use strict';

if (process.env.NODE_PRODUCTION){
	global.isProd=true;
	console.warn("++++++ INSTALLING PRODUCTION ENVIRONEMENT ...");
} else {
	global.isProd=false;
	console.info("++++++ developpement ");
}

var path = require('path');
global.ROOT = path.resolve(".");



var gulp = require('gulp');

gulp.task('clean', require('./tasks/clean'));
gulp.task('ejs-html',require("./tasks/ejs-html"));
gulp.task('ejs-js',require("./tasks/ejs-js"));

gulp.task('copy', require('./tasks/copy'));
gulp.task('styles', require('./tasks/styles'));

gulp.task('sass', require('./tasks/sass'));

gulp.task('browserSync', require('./tasks/browserSync'));
gulp.task('watch', ['browserSync'], require('./tasks/watch'));

gulp.task('browserify', require('./tasks/browserify'));

gulp.task('jshint',require("./tasks/jshint"));

gulp.task('uglify',require("./tasks/uglify"));

var runSequence = require('run-sequence');

gulp.task('default', ['clean'],function(cb) {

    cb = cb || function() {};

    runSequence([
		'ejs-html',
		'ejs-js',
	    'styles', 
	    'sass', 
	    'copy', 
	],[
	    'jshint',
	    'browserify'
    ], 'watch', cb);
});

gulp.task('dist', ['clean'],function(cb) {

    cb = cb || function() {};

    runSequence(
		[
		'ejs-html',
		'ejs-js',
	    'styles', 
	    'sass', 
	    'copy'
		],[
			'jshint',
			'browserify'
		],[
			'uglify'
		]);
});
