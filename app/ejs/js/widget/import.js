 /**
 * This hanld the Tree Overlay widget
 */
'use strict';
<% var currentName="import"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>


var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/Error');

var Display = require('../lib/display');

var Store = require('../store/Store');
var Import = require('../store/Import');

var Widget = require('../lib/widget');

var SINGLETON={};

SINGLETON.id="<%= currentName %>";
SINGLETON.template="<%- render.partial("./js/widget/"+currentName+".ejs") -%>";



function readInfo(event){

	var el=$('#import-content');

	if (el.length<=0){
		return ;
	} else {
		var value=el.val();

		Import.import(value);
		// if (!value){
		// 	return ;
		// }
		// debugger;
		// var array = value.split("\n\n");
		// log.info(array.length);
		
		// Store.importStringArray(array);
		// // Application.render();
		// // Tree.render("#tree");
		// // Con.render("#consolidated");
	}
	
}
SINGLETON.documentReady=function(){

	$(document).on("click","#import-validate",function(event){
		readInfo();
		$(document).trigger("trlg:widget-change-visivility","import");

	});

	$(document).on("click","#import-cancel",function(event){
		$(document).trigger("trlg:widget-change-visivility","import");
	});

	
};

SINGLETON.close=function(){
	if (SINGLETON.opened){
		$(SINGLETON.selector).fadeOut();
		
		SINGLETON.opened=false;
	}
};

SINGLETON.open=function(){
	if (!SINGLETON.opened){
		SINGLETON.opened=true;
		SINGLETON.render();

		$(SINGLETON.selector).fadeIn();		
	}
};

SINGLETON.save=function(){
	return Import.save();
};

SINGLETON.load=function(){
	return Import.load();
};


/**
 * The iner display function ...
 */
SINGLETON.display=function(){
	var win=$(window);
	var height=win.height()-150;

	var data={
		height:height
	};
	var content=Display.render(SINGLETON.id,data);

	return content;
};


/**
 * Creates the widget with the rented function.
 */
var WIDGET=new Widget(function(el){
	el.html(SINGLETON.display());

},"#import",false);



/**
 * Merges both documents
 */
SINGLETON=$.extend(WIDGET,SINGLETON);


module.exports=SINGLETON;

