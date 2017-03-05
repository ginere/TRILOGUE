/**
 * Appication entry point
 */
'use strict';
<% var currentName="app"; %>
<%- include('./snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

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
