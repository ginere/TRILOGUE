/**
 * GlobalProperties This stores the global properties allowing to
 * overwrite its values
 */
'use strict';
<% var currentName="GlobalProperties"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var SINGLETON={};


var PROPERTYES={
	DEFAULT_TABLE_TITLE:"New Table"
};

SINGLETON.get=function(name,defaultValue){
	if (name && PROPERTYES[name]){
		return name;
	} else {
		return defaultValue;
	}
};

module.exports=SINGLETON;
