/**
 * This is a handlebars based template engine
 * See also the ~/projects/video-skins/skin-black/src/ejs/js/lib/display.js mustache based template engine
 * But we are moving to a react.js based engine
 */
'use strict';

console.log("Loading file:display.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

var $ = require('jquery');
var Q = require('q');
var Handlebars=require('handlebars');

var log = require('../lib/log');
// var Error = require('../lib/Error');

var SINGLETON={};

// here we store the compiled templates
var TEMPLATES={	
};


SINGLETON.registerPartial=function(partialId,source){
    Handlebars.registerPartial(partialId,source);    
	// Also compile to be used as a template
	return SINGLETON.compile(partialId,source);
};

SINGLETON.compile=function(templateId,source){
    var deferred = Q.defer();
    setTimeout(function(){
        try {
            var template=Handlebars.compile(source);
            TEMPLATES[templateId]=template;
            
            return deferred.resolve(template);
        }catch(err){
            var error=new Error("Compiling templateId: " + templateId);
            error.parent=err;
            
            deferred.reject(error);
        }
    }, 0);
    return deferred.promise;    
};

/**
 * This apply the template to that data and return de values USING
 * THE PARTIALS DEFINED GLOBALY
 */ 
SINGLETON.render=function(templateId,data){
	
    if (TEMPLATES[templateId]){
        try {
            return (TEMPLATES[templateId])(data);
        }catch(err){
            var error=new Error("While executing templateId: " + templateId);
            error.parent=err;

            throw error;
        }
    } else {
        throw new Error("Template ID:'"+templateId+"' not found, compile it before.");
    }
};


/**
 * For the elements passed in param, ex: "#pepe",".class","this".
 * Use the content as a template and the date passed to render into.
 */
SINGLETON.renderInto=function(element,data){
	$(element).each(function( index ) {
		var template=$(this).html();
		var content=SINGLETON.render(template,data);
		$(this).html(content);
	});
};

/**
 * Uses the template and the date to generate a content the will be inserted into 
 * The element
 */
SINGLETON.renderIntoElement=function(element,templateId,data){
	var content=SINGLETON.render(templateId,data);
	$(element).each(function( index ) {
		$(this).html(content);
	});	
};


module.exports=SINGLETON;
