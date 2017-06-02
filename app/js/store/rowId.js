/**
 * Use this to dealing with rowsid, reteivening ang generate
 */
'use strict';

console.log("Loading file:rowId.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

var $ = require('jquery');

var SINGLETON={};

var rowGenerator=0;

SINGLETON.init=function(){
	rowGenerator=0;
};


SINGLETON.get=function(obj){
	if (obj && obj.id ){
		return obj.id;
	} else {
		return SINGLETON.generateId();
	}
};

SINGLETON.generateId=function(){
	return rowGenerator++;
};


module.exports=SINGLETON;


