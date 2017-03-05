/**
 * This is the comon globl log interface.
 */
'use strict';
<% var currentName="log"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var SINGLETON={};


function inner(f,levelText,text,err){
	if (typeof err !== 'undefined') {
		f(levelText+" "+text+err);
	} else {
		f(levelText+" "+text);
	}
}

SINGLETON.debug=function(text,err){
	inner(console.debug,"Debug",text,err);
};

SINGLETON.info=function(text,err){
	inner(console.info,"Info",text,err);
};

SINGLETON.warn=function(text,err){
	inner(console.warn,"WARN",text,err);
};

SINGLETON.error=function(text,err){
	inner(console.error,"ERROR",text,err);
};

SINGLETON.fatal=function(text,err){
	inner(console.error,"FATAL",text,err);
};

module.exports=SINGLETON;

