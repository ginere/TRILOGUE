'use strict';

/* bundleLogger
 * ------------
 * Provides gulp style logs to the bundle method in browserify.js
 */

var gutil        = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var startTime;

module.exports = {

  start: function() {
    startTime = process.hrtime();
  },

  end: function() {
    var taskTime = process.hrtime(startTime);
    var prettyTime = prettyHrtime(taskTime);
    gutil.log(gutil.colors.green('\'Rebundle\''), 'in', gutil.colors.magenta(prettyTime));
  }
};