/**
 * GlobalProperties This stores the global properties allowing to
 * overwrite its values
 */
'use strict';

/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

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
