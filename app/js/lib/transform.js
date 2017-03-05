/**
 * This is a handlebars based template engine
 * See also the ~/projects/video-skins/skin-black/src/ejs/js/lib/display.js mustache based template engine
 * But we are moving to a react.js based engine
 */
'use strict';

/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

var $ = require('jquery');
var Q = require('q');


var log = require('../lib/log');
// var Error = require('../lib/Error');

var SINGLETON={};


/**
 * This functions create a copy of the object using the trnasformer to transform a value:
 */
SINGLETON.T=function(obj,t){
	if (typeof obj === 'undefined'){
		// T(undefined,*) -> undefined
		return;
	} else if (obj === null){
		// T(null,*) -> null
		return null;
	} else if ($.isFunction(obj)){
		// T(f,*) -> f
		return obj;
	} else if ($.isArray(obj)){
		// T([x1,x2,...],*) -> [T(1,*),T(x2,*),...]
		debugger;
		var ret1=new Array(obj.length);

		$.each(obj,function(key,value){
			ret1[key]=SINGLETON.T(value,t);
		});

		return ret1;
	} else if (typeof obj !== 'object'){
		// T(!obj,*) -> obj
		// If obj is not a object return the value
		return obj;
	} else {
		// transforming an object
		if (typeof t === 'undefined'|| t ===null ){
			// T(obj,undefined,null) -> obj;
			// Not transformed defined
			return obj;
		} else if ($.isFunction(t)){
			// T(obj,f) -> f(obj);
			return t(obj);
		} else if ($.isArray(t)){
			// applying all the transformer of the array
			debugger;
			// T(obj,[t1,y2,...]) -> [T(obj,t1),T(obj,t2),...]
			var ret2=obj;

			$.each(t,function(key,value){
				ret2=SINGLETON.T(ret2,t);
			});
			
			return ret2;
		} else if ($.type(t) === 'string'){
			// T(obj,"name") -> obj["name"]
			return obj[t];
		} else if ($.type(t) === 'object'){
			// t={name:f,
			// }

			var ret={};
			$.each(t,function(key,value){
				if ($.isFunction(value)){
					ret[key]=value(obj);
				} else if ($.type(value) === 'string' ){
					if ($.type(value) === 'undefined'){
						// nothing to to
						// ret[key]=undefined;
					} else if (value === null){
						ret[key]=null;
					} else {
						ret[key]=obj[value];
					}
				} else {
					ret[key]=obj[key];
				}
			});
			return ret;
		} else {
			// here the object
			return obj;
		}
	}
};

module.exports=SINGLETON;
