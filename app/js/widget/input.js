 /**
 * This hanld the Tree Overlay widget
 */
'use strict';

console.log("Loading file:input.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false */


var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/Error');

var Display = require('../lib/display');

var Store = require('../store/Store');

var Widget = require('../lib/widget');

//var Tree = require('../widget/tree');
//var Con = require('../widget/consolidated');
//var Application = require('../Application');

var SINGLETON={};


function readInfo(event){

	//var text=$("#input-doc").val();

	var array = $('#input-doc').val().split("\n\n");
	log.info(array.length);

	Store.importStringArray(array);
	// Application.render();
	// Tree.render("#tree");
	// Con.render("#consolidated");
	
}

SINGLETON.id="input";
SINGLETON.template="<div class=\"con-section-{{node.level}}\"> <span class=\"con-title-{{node.level}}\">{{node.title}}</span> <span {{#row.id}}id=\"con-{{.}}\"{{/row.id}} class=\"con-body-{{node.level}} editable\" {{#row.id}}data-row=\"{{.}}\"{{/row.id}}>{{cell.text}}</span> {{{childsHtml}}}</div>";

SINGLETON.init=function(){
	return null;
};

/**
 * Creates the widget with the rented function.
 */
var WIDGET=new Widget(function(el){
	$(el).click(readInfo);
//	$("#read").click(readInfo);
},"#input-doc");



/**
 * Merges both documents
 */
SINGLETON=$.extend(WIDGET,SINGLETON);


module.exports=SINGLETON;

