'use strict';

var config = require('../config');
var gulp   = require('gulp');
var del    = require('del');

function clean(cb) {
	return del([config.dist], cb);
}

module.exports = clean;