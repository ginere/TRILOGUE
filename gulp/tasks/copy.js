'use strict';

var config = require('../config');
var gulp = require('gulp');

function fontsGulp() {

	// javascript
// 	gulp.src(['node_modules/gentelella/vendors/jquery/dist/jquery.min.js'])
// 	    .pipe(gulp.dest(config.dist + '/vendors/jquery/'));

// 	gulp.src(['node_modules/gentelella/vendors/bootstrap/dist/js/bootstrap.min.js'])
// 	    .pipe(gulp.dest(config.dist + '/vendors/bootstrap/js/'));

// 	gulp.src(['node_modules/gentelella/vendors/fastclick/lib/fastclick.js'])
// 	    .pipe(gulp.dest(config.dist + '/vendors/fastclick/lib/'));

// 	gulp.src(['node_modules/gentelella/vendors/nprogress/nprogress.js'])
// 	    .pipe(gulp.dest(config.dist + '/vendors/nprogress/'));

// 	gulp.src(['node_modules/gentelella/build/js/custom.min.js'])
// 	    .pipe(gulp.dest(config.dist + '/vendors/gentelella/js/'));

// 	// images
// 	gulp.src(['node_modules/gentelella/production/images/*'])
// 	    .pipe(gulp.dest(config.dist + '/images'));

// 	// images
// 	gulp.src(['app/images/*'])
// 	    .pipe(gulp.dest(config.dist + '/images'));

	// DATA
 	gulp.src(['app/ejs/data/*'])
 	    .pipe(gulp.dest(config.dist + '/data'));
	

	// JQUERY
 	gulp.src(['node_modules/jquery/dist/*'])
 	    .pipe(gulp.dest(config.distVendors + '/jquery'));

	// NORMALIZE
 	gulp.src(['node_modules/normalize.css/normalize.css'])
 	    .pipe(gulp.dest(config.distVendors + '/normalize'));

	// BOOTSTRAP
 	gulp.src(['node_modules/bootstrap/dist/**/*'])
 	    .pipe(gulp.dest(config.distVendors + '/bootstrap'));


	// Datatables
 	gulp.src(['node_modules/datatables.net*/**/'])
 	    .pipe(gulp.dest(config.distVendors + '/datatables'));


    // Font-awesome
 	gulp.src(['node_modules/font-awesome/fonts/*'])
 	    .pipe(gulp.dest(config.distVendors + '/font-awesome/fonts'));
	
	return gulp.src(['node_modules/font-awesome/css/*'])
	    .pipe(gulp.dest(config.distVendors + '/font-awesome/css'));
}

module.exports = fontsGulp;
