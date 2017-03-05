/**
 * Use this to dealing with rowsid, reteivening ang generate
 */
'use strict';
<% var currentName="rowId"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

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


