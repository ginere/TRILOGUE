'use strict';


var gulp = require("gulp");
var jshint = require("gulp-jshint");
var notify = require('gulp-notify');

module.exports = function() {

	// This is to avoid js/vendor/jquery.easing.1.3.js errors
     return gulp.src(["app/js/**/*.js",
					 ])
		.pipe(jshint('.jshintrc'))
    // .pipe(jshint(jshintConfig))
         .pipe(jshint.reporter("default",{verbose:true}))
//         .pipe(notify({
//             title: 'JSHint',
//             message: 'JSHint Passed. Let it fly!',
//         }))
	;
};