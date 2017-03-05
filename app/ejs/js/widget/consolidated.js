 /**
 * This hanld the Tree Overlay widget
 */
'use strict';
<% var currentName="consolidated"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>


var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/Error');

var Display = require('../lib/display');

var Store = require('../store/Store');
var Selection = require('../store/Selection');

var Widget = require('../lib/widget');
var Scroll = require('../lib/scroll-to');

var Editor = require('../widget/editor');

var SINGLETON={};

SINGLETON.id="<%= currentName %>";
SINGLETON.template="<%- render.partial("./js/widget/"+currentName+".ejs") -%>";


function clearSelection(){
	var container=$(SINGLETON.selector);
	var selected=container.find(".selected");
	
	if (selected.length !== 0) {
		selected.removeClass("selected");
	}
}

function setSelection(rowId){
	if (rowId){
		var id="#con-"+rowId;
		$(id).addClass('selected');

		Scroll.to($(id));
	}
}

function updateCellValue(rowId,text){
	if (rowId){
		var id="#con-"+rowId;
		if ($(id).length>0){
			$(id).fadeOut(5,function(){
				$(id).text(text);
				$(id).fadeIn();
			});
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
	
// 	if (selected.length === 0) {
// 		// none selected, select the first or the last
// 		if (forward) { // Select the first element that is the second row. The first row is the header.
// 			newSelection=container.find("section:eq(0)"); //.toggleClass('selected');
//			
// 			// viewport.scrollToElement(container.find("li:eq(1)"));
//			
// 		} else { // select the last elemnt
// 			newSelection=container.find("section:last"); //.toggleClass('selected');
// 			// viewport.scrollToElement(container.find("li:last"));
// 		}
// 	} else {
// 		if (forward) {
// 			var next=selected.next();
// 			if (next.length === 0) {
// 				next=container.find("section:eq(0)");
// 			}
// 			newSelection=next; //.toggleClass('selected');
// 			// viewport.scrollToElement(next);
// 		} else {
// 			var prev=selected.prev();
//			
// 			if (prev.length === 0) {
// 				prev=container.find("section:last");
// 			}
// 			newSelection=prev; //.toggleClass('selected');
// 			// viewport.scrollToElement(prev);
// 		}
//		
// 		selected.toggleClass('selected');
// 	}
//
// 	var id=newSelection[0].id;
// 	id=id.replace("con-","");
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
//}


// /**
//  * The initialization
//  */
// SINGLETON.init=function(){
// 	return Display.compile(SINGLETON.id,SINGLETON.template);
// };

/**
 * Subscriving events ...
 */
SINGLETON.documentReady=function(){
	Store.listenOnTableReloaded(function(event){
		SINGLETON.render();
	});
	
	Store.listenOnChange(function(event){
		SINGLETON.render();
	});

	Selection.listenOnColumnTypeChanged(function(event){
		log.info("listenOnColumnTypeChanged");
		SINGLETON.render();
	});

	Store.listenOnCellChanged(function(event,node,row,cell,columnType){
		if (SINGLETON.isOpen()){
			if (row && row.id && cell && cell.text) {
				updateCellValue(row.id,cell.text);
			}
		}
	});


	Selection.listenOnSelectionChanged(function(event,node,row,cell){
		// Change the selection
		if (SINGLETON.isOpen()){			
			clearSelection();

			if (row){
				setSelection(row.id);
			}
		}
	});

	$(document).on("click","#consolidated .editable",function(event){
		var rowId=$(this).data("row");
		Editor.open(rowId,$(this));
	});

};

SINGLETON.close=function(){
	if (SINGLETON.opened){
		$(SINGLETON.selector).fadeOut();
		
		SINGLETON.opened=false;
		$(document).trigger("trlg:widget-visivility-changed",SINGLETON.opened);
	}
};

SINGLETON.open=function(){
	if (!SINGLETON.opened){
		SINGLETON.opened=true;
		SINGLETON.render();

		$(SINGLETON.selector).fadeIn();
		
		displaySelection();
		
		$(document).trigger("trlg:widget-visivility-changed",SINGLETON.opened);
	}
};

// SINGLETON.handleEvent=function(event){
// 	var code=event.which;
// 	switch(code){
// 	case 37:
// 		nodeUp(event);
// 		event.preventDefault();
// 		event.stopPropagation();
// 		break;
// 	case 39:
// 		nodeDown(event);
// 		event.preventDefault();
// 		event.stopPropagation();
// 		break;
// 	case 38:
// 		previousSelection(event);
// 		event.preventDefault();
// 		event.stopPropagation();
// 		break;
// 	case 40:
// 		nextSelection(event);
// 		event.preventDefault();
// 		event.stopPropagation();
// 		break;
// 	default:
// 		console.debug("Editor Key code:"+code);
// 		break;
// 	}
//};

/**
 * The iner display function ...
 */
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
			html="<h1>"+node.title+"</h1><section>"+node.html+'</section>';
			delete node.html;
		} 


		return null;
	},Selection.getSelectedColumnType());

	return html;
};




/**
 * Creates the widget with the rented function.
 */
var WIDGET=new Widget(function(el){
	el.html(SINGLETON.display());

	displaySelection();
},"#consolidated",false);


/**
 * Merges both documents
 */
SINGLETON=$.extend(WIDGET,SINGLETON);


module.exports=SINGLETON;

