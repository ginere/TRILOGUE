/**
 * This handle Promisses and errors
 */
<% var currentName="error"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var Q = require('q');

var log = require('../lib/log');

var SINGLETON={};

/**
 * http://dailyjs.com/2014/01/30/exception-error/
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
 */
function ApplicationError(message,parent,caller){
	// Call the constructor
	Error.call(this);
	
	if (caller) {
		Error.captureStackTrace(this, caller);
	} else {
		/*jshint -W059 */
		Error.captureStackTrace(this, arguments.callee);
		/*jshint +W059 */
	}
	this.message = message;
	this.parent = parent;
}

SINGLETON.createApplicationError=function(text,err){
	/*jshint -W059 */
	return new ApplicationError(text,err,arguments.callee);
	/*jshint +W059 */
};

/**
 * Create a reject promise.
 * See: http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
 */
SINGLETON.reject=function(text,err){
	if (err) {
		/*jshint -W059 */
		return Q.reject(new ApplicationError(text,err,arguments.callee));
		/*jshint +W059 */
	} else {
		return Q.reject(text);
	}
};

SINGLETON.log=function(msg,err) {

	log.error(msg);

	log.error(err.message);
	log.error(err.stack);
	
	if (err.parent) {
		SINGLETON.log("-- Cause -->:",err.parent);
	}
};

module.exports=SINGLETON;

