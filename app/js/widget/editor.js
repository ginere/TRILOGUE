 /**
 * This hanld the Tree Overlay widget
 */
'use strict';

console.log("Loading file:editor.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */


var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/error');

var Display = require('../lib/display');

var Store = require('../store/Store');
var Selection = require('../store/Selection');

var SINGLETON={};

SINGLETON.id="editor";
SINGLETON.template="<div id=\"editor\" style=\"border: 1px gray solid;padding: 2px;border-radius: 3px;background:  rgba(187, 224, 255, 0.37);\"><div class=\"text-center\"> &nbsp;</div> <textarea style=\"width:100%;height:{{height}}px; padding:10px;border-radius: 3px;\" id=\"editor-content\">{{text}}</textarea><div class=\"text-center\"> <button type=\"button\" class=\"btn btn-xs btn-danger\" id=\"editor-cancel\">Cancel [Esc]</button> <button type=\"button\" class=\"btn btn-xs btn-success\" id=\"editor-validate\"> OK [C-Entr]</button></div></div>";

SINGLETON.opened=false;


var currentRowId=null;
var currentColumnType=null;

function createEditor(el,text,rowId,columnType){
	currentRowId=rowId;
	currentColumnType=columnType;		

	var height = $(el).height();
	var width = $(el).width();

	var data={
		width:width,
		height:height+20,
		text:text
	};
	var content=Display.render(SINGLETON.id,data);
	
	$(el).html(content);
	$(el).removeClass("editable");
	
//	$(el).html("<textarea id='editor'></textarea>");
//	var editor=$("#editor-content");
//	editor.val(text);
	
//    editor.css({'width':width,'height': height});
	$("#editor-content").focus();
	SINGLETON.opened=true;

}

SINGLETON.init=function(){
	return Display.compile(SINGLETON.id,SINGLETON.template);
};

SINGLETON.documentReady=function(){

	$(document).on("click","#editor-cancel",function(event){
		SINGLETON.close();
	});

	$(document).on("click","#editor-validate",function(event){
		SINGLETON.validate();
	});

	// Setting up listeners on Store Changes ...
	Store.listenOnTableReloaded(function(event){
		if (SINGLETON.isOpen()){
			SINGLETON.close();
		}
	});
	
	Store.listenOnChange(function(event){
		if (SINGLETON.isOpen()){
			SINGLETON.close();
		}
	});

	Store.listenOnCellChanged(function(event,node,row,cell,columnType){
		if (SINGLETON.isOpen()){
			// TODO: A cell has been changed by someone else ...
			// SINGLETON.setCellValue();
		}
	});

	Selection.listenOnSelectionChanged(function(event,node,row,cell){
		if (SINGLETON.isOpen()){
			SINGLETON.close();
			if (row){
				SINGLETON.open(row.id);
			}
		}
	});
};

SINGLETON.close=function(text){
	var editor=$("#editor");

	debugger;
	if (editor.length>0){
		// var value=$("#editor-content").val();
		
		editor.parent().addClass("editable");
		if (!text) {
			text=Store.getValue(currentRowId,"",currentColumnType);
			// restore the old text
			editor.parent().text(text);
		} else {
			// launch the event
			if (!Store.setValue(currentRowId,text,currentColumnType)){
				// The event wont be launched ... Just write the text back
				editor.parent().text(Store.getValue(currentRowId,""));
			}
			// This will be donne by the call back
		}
		
		SINGLETON.opened=false;
		currentRowId=null;
		currentColumnType=null;
	}
};

SINGLETON.validate=function(){
	var editor=$("#editor");
	
	if (editor.length>0){
		debugger;
		var value=$("#editor-content").val();
		SINGLETON.close(value);
				
		// Store.setValue(currentRowId,value);
	}
	
};

SINGLETON.isOpen=function(){
	return SINGLETON.opened;
};

SINGLETON.open=function(rowId,element,columnType){
	debugger;
	// var element=$("#con-"+rowId);

	if (element.length<=0){
		return;
	}

	if (currentRowId){
		if (currentRowId === rowId){
			return ;
		} else {
			SINGLETON.close();
		}
		
	}

	var cell=Store.getCellFromRowId(rowId,null,columnType);

	if (cell) {
		createEditor(element,cell.text,rowId,columnType);
	}
};


module.exports=SINGLETON;
