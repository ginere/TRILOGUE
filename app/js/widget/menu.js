 /**
 * This hanld the Tree Overlay widget
 */
'use strict';

/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */


var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/Error');

var Widget = require('../lib/widget');
var Display = require('../lib/display');

var Store = require('../store/Store');
var Selection = require('../store/Selection');

var DOC1=require('../data/doc1');
var DOC2=require('../data/doc2');


var SINGLETON={};

SINGLETON.id="menu";
SINGLETON.template="<div class=\"menu-bar\"><div class=\"btn-group\"> {{#columns}} <button id=\"menu-{{id}}\" data-columntype=\"{{id}}\" type=\"button\" class=\"btn btn-default btn-xs menu-select-columntype\">{{name}}</button> {{/columns}}</div> &nbsp;<div class=\"btn-group\"> <button id=\"tree-btn\" data-view=\"tree\" type=\"button\" class=\"btn btn-default btn-xs select-view\"><i class=\"fa fa-columns\" aria-hidden=\"true\"></i> Outline [T]</button> <button id=\"consolidated-btn\" data-view=\"consolidated\" type=\"button\" class=\"btn btn-default btn-xs select-view\"><i class=\"fa fa-bars\" aria-hidden=\"true\"></i> Cons [G]</button> <button id=\"grid-btn\" data-view=\"grid\" type=\"button\" class=\"btn btn-default btn-xs select-view\"><i class=\"fa fa-table\" aria-hidden=\"true\"></i> Editor [G]</button></div> &nbsp;<div class=\"btn-group\"> <button id=\"import-btn\" data-view=\"import\" type=\"button\" class=\"btn btn-default btn-xs select-view\"><i class=\"fa fa-sign-in\" aria-hidden=\"true\"></i> Import [I]</button> <button id=\"import-btn\" data-view=\"save\" type=\"button\" class=\"btn btn-default btn-xs select-view\"><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i> Save [S]</button> <button id=\"import-btn\" data-view=\"load\" type=\"button\" class=\"btn btn-default btn-xs select-view\"><i class=\"fa fa-floppy\" aria-hidden=\"true\"></i> Load [L]</button></div><div class=\"btn-group\"> <button id=\"doc1\" data-view=\"doc1\" type=\"button\" class=\"btn btn-default btn-xs select-view\"> Doc 1</button> <button id=\"doc2\" data-view=\"doc2\" type=\"button\" class=\"btn btn-default btn-xs select-view\"> Doc 2</button></div></div>";

/**
 * The initialization
 */
//SINGLETON.init=function(){
// 	return Display.compile(SINGLETON.id,SINGLETON.template);
//};


function displaySelectedColumn(){
	// unselect
	$(".menu-select-columntype").removeClass("selected");
	// select
	var selectedColumn=Selection.getSelectedColumnType();
	$("#menu-"+selectedColumn).addClass("selected");
	
}


SINGLETON.setVisible=function(id,visible){
	var el=$(id);
	if (el.length){
		if (visible){
			el.addClass("selected");
		} else {
			el.removeClass("selected");
		}
	}
};



/**
 * Subscriving events ...
 */
SINGLETON.documentReady=function(){
	// change column event
	$(document).on("click",".menu-select-columntype",function(event){

		var columntype=$(this).data("columntype");

		if (columntype){
			Selection.setSelectedColumnType(columntype);
		}
	});

	$(document).on("click",".select-view",function(event){
		var view=$(this).data("view");
		
		if (view){
			if (view === "doc1" ){
				Store.setTable(DOC1);
			} else if (view === "doc2" ){
				Store.setTable(DOC2);				
			} else {
				$(document).trigger("trlg:widget-change-visivility",view);
			}
		}
	});

	// Columntype Changed
	Selection.listenOnColumnTypeChanged(function(event){
		displaySelectedColumn();
	});
		
};

SINGLETON.display=function(){
	var data={
		columns:Store.getColumnsTypes()
	};
	var content=Display.render(SINGLETON.id,data);

	return content;
};

/**
 * Creates the widget with the rented function.
 */
var WIDGET=new Widget(function(el){
	el.html(SINGLETON.display());

	displaySelectedColumn();
	
},"#menu",true);


/**
 * Merges both documents
 */
SINGLETON=$.extend(WIDGET,SINGLETON);


module.exports=SINGLETON;

