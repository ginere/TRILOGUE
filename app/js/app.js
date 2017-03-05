/**
 * Appication entry point
 */
'use strict';

/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

var $ = require('jquery');
var $q = require('q');

var log = require('./lib/log');
var Error = require('./lib/error');

var Application = require('./Application');

log.debug("Starting app ...");

$q(
	// Init the application as soon as possible
	Application.init()
	
).then(function(){
	// The docuemnt ready
	$(document).ready(function(){
		Application.documentReady();
		Application.render();		
	});

}).catch(function(err){
	// In case of error.
	Error.log("Application error",err);	
});
