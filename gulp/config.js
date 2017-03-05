'use strict';

var SINGLETON = {
	port: 3000,
	dist: './dist',
	distVendors: './dist/vendors',
	scripts: '/js',
	scriptsEntryPoint: './app/js/app.js',
	metaPath: global.ROOT+'/app/ejs/METADATA.json',
	APP_PATH: global.ROOT+'/app'
};

if (global.isProd) {
	console.warn("++++++ CONFIGURING PRODUCTION ENVIRONEMENT ...");
	SINGLETON.DEBUG=false;
} else {
	console.warn("++++++ Configuring dev environement ...");
	SINGLETON.DEBUG=true;

}

module.exports= SINGLETON;