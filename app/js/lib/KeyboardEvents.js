/**
 * The Editor main class
 *
 * - The entry point is the render 
 */
'use strict';

/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

var $ = require('jquery');

var SINGLETON={};

var M_keyMap={}; // Modifier key map
var NM_keyMap={}; // No Modifier key map

var defaultFunction=null;

function handleEvent(event){
	var code=event.which;
	var f;

	if (event.altKey || 
		event.altKey ||
		event.ctrlKey ||
		event.metaKey ){

		f=M_keyMap[code];
		if ($.isFunction(f)){
			f(event);
			
			// event.preventDefault();
		} else {
			if (defaultFunction){
				defaultFunction(event);
			} else {
				console.debug("M Key code:"+code);
			}
		}						
	} else {
		// ESC KEY Traverses elements is global
		if ( $(event.target).is("body") || code === 27 ) {					
			f=NM_keyMap[code];
			if ($.isFunction(f)){
				f(event);
				
				// event.preventDefault();
			} else {
				if (defaultFunction){
					defaultFunction(event);
				} else {
					console.debug("Key code:"+code);
				}
			}						
		}
	}
	
}


SINGLETON.shorcut=function(keyCode,modifier,f){
	if (keyCode){
		if (modifier) {
			if ( M_keyMap[keyCode] !== undefined ) {
				console.warn("Overwriting key modifier code:"+keyCode);
			}
			M_keyMap[keyCode]=f;
		} else {
			if ( NM_keyMap[keyCode] !== undefined ) {
				console.warn("Overwriting non-modifier key code:"+keyCode);
			}
			NM_keyMap[keyCode]=f;
		}
	}
};

SINGLETON.default=function(f){
	if ($.isFunction(f)){
		defaultFunction=f;
	}
};

SINGLETON.subscriveEvents=function(){
	$(document).on('keydown',handleEvent);
};


//SINGLETON.init=function(){
//	
//};

SINGLETON.ready=function(){
	SINGLETON.subscriveEvents();
};

module.exports=SINGLETON;
