 /**
 * This hanld the Tree Overlay widget
 */
'use strict';
<% var currentName="menu"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>


var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/error');

var Widget = require('../lib/widget');
var Display = require('../lib/display');

var Store = require('../store/Store');
var Selection = require('../store/Selection');

var DOC1=require('../data/doc1');
var DOC2=require('../data/doc2');


var SINGLETON={};

SINGLETON.id="<%= currentName %>";
SINGLETON.template="<%- render.partial("./js/widget/"+currentName+".ejs") -%>";

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

