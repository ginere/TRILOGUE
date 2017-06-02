/**
 * This hanld the Tree Overlay widget
 */
'use strict';
<% var currentName="tree"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>


var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/error');

var Display = require('../lib/display');

var Store = require('../store/Store');
var Selection = require('../store/Selection');

var Widget = require('../lib/widget');
var Scroll = require('../lib/scroll-to');

var SINGLETON={};

SINGLETON.id="<%= currentName %>";
SINGLETON.template="<%- render.partial("./js/widget/tree.ejs") -%>";

function clearSelection(){
	var container=$(SINGLETON.selector);
	var selected=container.find(".selected");

	if (selected.length !== 0) {
		selected.removeClass("selected");
	}
}

function setSelection(rowId){
	if (rowId){
		var id="#tree-"+rowId;
		var el=$(id);
		
		if (el.length>0){
			$(id).addClass('selected');
			
			Scroll.toParent($(id),"#tree");
		}
	}
}

function displaySelection(){
	clearSelection();
	var row=Selection.getSelectedRow();
	if (row){
		setSelection(row.id);
	}
}


// function changeSelection(forward){
// 	var container=$(SINGLETON.selector);
// 	var selected=container.find(".selected");
// 	var newSelection;
//	
// 	if (selected.length === 0) {
// 		// none selected, select the first or the last
// 		if (forward) { // Select the first element that is the second row. The first row is the header.
// 			newSelection=container.find("li:eq(0)"); //.toggleClass('selected');
//			
// 			// viewport.scrollToElement(container.find("li:eq(1)"));
//			
// 		} else { // select the last elemnt
// 			newSelection=container.find("li:last"); //.toggleClass('selected');
// 			// viewport.scrollToElement(container.find("li:last"));
// 		}
// 	} else {
// 		if (forward) {
// 			var next=selected.next();
// 			if (next.length === 0) {
// 				next=container.find("li:eq(0)");
// 			}
// 			newSelection=next; //.toggleClass('selected');
// 			// viewport.scrollToElement(next);
// 		} else {
// 			var prev=selected.prev();
//			
// 			if (prev.length === 0) {
// 				prev=container.find("li:last");
// 			}
// 			newSelection=prev; //.toggleClass('selected');
// 			// viewport.scrollToElement(prev);
// 		}
//		
// 		selected.toggleClass('selected');
// 	}
//
// 	var id=newSelection[0].id;
// 	id=id.replace("tree-","");
//
// 	Selection.setSelectedRowId(id);	
// }
//
// function previousSelection(event){
// 	changeSelection(false);
// }
//
// function nextSelection(event){
// 	changeSelection(true);
// }
//
// function nodeUp(event){	
//	
// }
//
// function nodeDown(event){	
// }



/**
 * The initialization
 */
SINGLETON.init=function(){
	return Display.compile(SINGLETON.id,SINGLETON.template);
};

/**
 * Subscriving events ...
 */
SINGLETON.documentReady=function(){

	// Setting up listeners on Store Changes ...
	Store.listenOnTableReloaded(function(event){
		log.info("listenOnTableReloaded");
		SINGLETON.render();
	});

	Store.listenOnChange(function(event){
		log.info("listenOnChange");
		SINGLETON.render();
	});

	Selection.listenOnColumnTypeChanged(function(event){
		log.info("listenOnColumnTypeChanged");
		SINGLETON.render();
	});


	Selection.listenOnSelectionChanged(function(event,node,row,cell){
		log.info("Selection");
		// Change the selection
		if (SINGLETON.isOpen()){

			clearSelection();
			if (row){
				setSelection(row.id);
			}
		}
	});

};

SINGLETON.close=function(){
	if (SINGLETON.opened) {
		$(SINGLETON.selector).fadeOut();
		
		$(SINGLETON.selector).css("width","0px");
		$("#main").css("marginLeft","0px");
	
		SINGLETON.opened=false;		
		$(document).trigger("trlg:widget-visivility-changed",SINGLETON.opened);
	}
};

SINGLETON.open=function(){
	if (!SINGLETON.opened) {
		SINGLETON.opened=true;		
		SINGLETON.render();

		$(SINGLETON.selector).fadeIn();
		
		$(SINGLETON.selector).css("width","200px");
		$("#main").css("marginLeft","200px");
		
		displaySelection();
		
		$(document).trigger("trlg:widget-visivility-changed",SINGLETON.opened);
	}
};


SINGLETON.handleEvent=function(event){
	var code=event.which;
	// switch(code){
	// case 37:
	// 	nodeUp(event);
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	break;
	// case 39:
	// 	nodeDown(event);
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	break;
	// case 38:
	// 	previousSelection(event);
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	break;
	// case 40:
	// 	nextSelection(event);
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	break;
	// default:
	// 	console.debug("Editor Key code:"+code);
	// 	break;
	// }
};


SINGLETON.display=function(){
	var html="";

	Store.iterateRootLast(function(node,row,cell,columnType){
		if (node.parent){
			var data={
				node:node,
				row:row,
				cell:cell,
				columnType:columnType,
				childsHtml:node.html
			};
			
			delete node.html;
			
			var content=Display.render(SINGLETON.id,data);
			
			if (node.parent.html){
				node.parent.html+=content;
			} else {
				node.parent.html=content;
			}
		} else {
			html="<p>"+node.title+"</p><ul class='tree'>"+node.html+'</ul>';
			delete node.html;

		}
		
		return null;
	},Selection.getSelectedColumnType());

	return html;
};


var WIDGET=new Widget(function(el){
	el.html(SINGLETON.display());

	displaySelection();
},"#tree",true);


/**
 * Merges both documents
 */
SINGLETON=$.extend(WIDGET,SINGLETON);

module.exports=SINGLETON;

