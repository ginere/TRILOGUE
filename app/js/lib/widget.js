/**
 * This is the mother class for all the widgets. Widgets is a part on the html page.
 * The render fincion is only called if the selector passed exits.
 */
'use strict';

console.log("Loading file:widget.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
//var E = require('../lib/Error');

var Display = require('../lib/display');

var SINGLETON=function(_render,_el,_opened){

	var that={
		id:null,
		template:null,
		selector:_el,
		childRender:_render,
		opened:_opened
	};
	
	/**
	 * This function is called to initialize the view. 
	 * It may be called when the doom is not still
	 * present. This function returns a promise.
	 */
	that.init=function(){
		if (that.id && that.template){
			return Display.compile(that.id,that.template);
		} else {
			return null;
		}
	};

	/**
	 * This function should be called one after the document is ready.
	 * This function mat return a promise.
	 */
	that.documentReady=function(){
		return null;
	};

	that.close=function(){
		if (that.opened){
			that.opened=false;
			$(that.selector).fadeOut();

			$(document).trigger("trlg:widget-visivility-changed",that.opened);
		}
	};

	that.open=function(){
		if (!that.opened){
			that.opened=true;
			$(that.selector).fadeIn();
			
			$(document).trigger("trlg:widget-visivility-changed",that.opened);
		}
	};

	that.switch=function(){
		if (that.opened){
			that.close();		
		} else {
			that.open();
		}
		return that.opened;
	};

	that.isOpen=function(){
		return that.opened;
	};

	that.handleEvent=function(event){
		
	};

	that.listenOnVisivilityChanged=function(f){
		if ($.isFunction(f)){
			$(document).on("trlg:widget-visivility-changed",f);
		}	
	};


	that.render=function(_element){
		var target=(_element)?_element:that.selector;
		
		var el=$(target);
		
		if (!$.isFunction(that.childRender)) {
			throw new Error("The render function passed is not a function.");
		} else if (el.length<=0){
			log.info("No element found:"+target);
			return null;			
		} else {
			if (this.isOpen()) {
				// Only render if the document ins open
				this.open();
				return that.childRender(el);
			}
		}
	};

//	that.renderIntoElement=function(){
//		throw new Error.ApplicationError("renderIntoElement not implemented");
//	}
	
	return that;
};

module.exports=SINGLETON;
