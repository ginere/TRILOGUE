'use strict';

// https://www.npmjs.com/package/vinyl-source-stream

var config       = require('../config');
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var source       = require('vinyl-source-stream');
var sourcemaps   = require('gulp-sourcemaps');
var buffer       = require('vinyl-buffer');
//var streamify    = require('gulp-streamify');
var watchify     = require('watchify');
var browserify   = require('browserify');
//var uglify       = require('gulp-uglify');
var handleErrors = require('../util/handleErrors');
var browserSync  = require('browser-sync');
//var ngAnnotate   = require('browserify-ngannotate');
var shim         = require('browserify-shim');
var bundleLogger = require('../util/bundleLogger');
var brfs         = require('brfs');
//var babelify	 = require('babelify');

function browserifyBuild() {
	var entry = 'bundle.js';

	var bundler = browserify({
		entries: config.scriptsEntryPoint,
	    debug: true,
	    cache: {},
	    packageCache: {},
	    fullPaths: true
	}, watchify.args);

	if ( !global.isProd ) {
	    bundler = watchify(bundler);
	    bundler.on('update', function() {
	        rebundle();
	    });
	}

	var transforms = [
//		babelify,
	    shim,
//	    ngAnnotate,
	    brfs
	];

	transforms.forEach(function(transform) {
	    bundler.transform(transform);
	});

	function rebundle() {
	    var stream = bundler.bundle();
	    // var createSourcemap = global.isProd && config.browserify.sourcemap;
	    bundleLogger.start();
	    return stream.on('error', handleErrors)
	        .pipe(source(entry))
	        .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true, debug:true}))
	        .pipe(sourcemaps.write('./'))
	        .on('end', bundleLogger.end)
	        .pipe(gulp.dest(config.dist + config.scripts))
	        .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true, once: true })));
	}
	return rebundle();
}

module.exports = function() {
	return browserifyBuild();
};