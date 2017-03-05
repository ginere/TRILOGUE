'use strict';

var config        = require('../config');
var gulp          = require('gulp');

function watchGulp() {
	// var stylesToWatch = config.styles.watch.concat(config.styles.css);

	gulp.watch(['app/styles/**/*.less'],       
			   ['styles']);

	gulp.watch('app/sass/**/*.scss',
			   ['sass']);
	
	// gulp.watch(config.images.src,   ['images']);
	//	gulp.watch(['app/styles/fonts/*'],    
	//			   ['fonts']);

	gulp.watch(['app/ejs/*.html','app/ejs/**/*.ejs'],       
			   ['ejs-html']);

	gulp.watch(['app/ejs/js/**/*.js','app/ejs/js/**/*.ejs'],       
			   ['ejs-js']);

	gulp.watch(['app/js/**/*.js'],    
			   ['jshint']);

	gulp.watch(['app/ejs/data/*.json'],    
			   ['copy']);

//	gulp.watch(['app/index.html', 'app/views/**.html', 'app/views/directives/**.html'],  
//			   ['views']);
}

module.exports = watchGulp;
