'use strict';

var config       = require('../config');
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var handleErrors = require('../util/handleErrors');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
// var concatCss    = require('gulp-concat-css');
var less         = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');

// less plugins
// var LessPluginCleanCSS      = require('less-plugin-clean-css');
var LessPluginAutoPrefix    = require('less-plugin-autoprefix');
// var cleancss    = new LessPluginCleanCSS({ advanced: true });
var autoprefix  = new LessPluginAutoPrefix({browsers: ["last 2 versions", "> 1%", "ie 9"]});

function stylesGulp() {
	return gulp.src('app/styles/custom.less')
	    .pipe(less({
	        // plugins: global.isProd ? [cleancss, autoprefix] : []
	        plugins: [autoprefix]
	    }))
	    .on('error', handleErrors)
	    .pipe(sourcemaps.init())
	    .pipe(cleanCSS())
	    .pipe(sourcemaps.write('./'))
	    .pipe(gulp.dest('dist/css'))
	    .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));
}

module.exports = stylesGulp;
