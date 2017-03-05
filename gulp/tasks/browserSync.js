'use strict';

var config      = require('../config');
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var url         = require('url');
var proxy       = require('proxy-middleware');

function browserSyncGulp() {
	// var proxyOpts = url.parse(config.backendUrl);
	// proxyOpts.route = '/api';

	var browserSyncConfig = {
	    port: config.port,
	    server: {
	        baseDir: config.dist
	        // middleware: [proxy(proxyOpts)]
	    },
	    logPrefix: 'MY_PREFIX',
	    browser: ["google chrome"],
	    minify: false,
	    notify: false,
	    open: false
	};

	browserSync(browserSyncConfig);
}

module.exports = browserSyncGulp;