/**
 * This is the Main Store
 */
'use strict';

console.log("Loading file:Selection.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

var $ = require('jquery');
var $q = require('q');

var log = require('../lib/log');
var Error = require('../lib/error');

var RowId = require('../store/rowId');
var Row = require('../store/row');
var Node = require('../store/node');

var Store = require('../store/Store');



var SINGLETON={};


// The selection id the node because
// May be there are node without rows.
var selectedNode=null;
var selectedRow=null;
var selectedCell=null;

// The selected column
// var selectedColumnType=Store.getColumnType();


SINGLETON.getSelectedRow=function(){
	return Node.getRow(selectedNode,null);
};

SINGLETON.setSelectedRowId=function(rowId,columnType){	
	var row=Row.get(rowId,null);

	SINGLETON.setSelectedRow(row,columnType);
};

function validateColumnType(columnType,defaultValue){
	return Store.validateColumnType(columnType,defaultValue);
}

SINGLETON.clearSelection=function(){
	// selectedColumnType=Store.getColumnType();
	
	selectedNode=null;
	selectedRow=null;
	selectedCell=null;
	
};

SINGLETON.setSelectedRow=function(row,columnType){
	var currentCoulmType=validateColumnType(columnType,SINGLETON.getSelectedColumnType());
	
	if (row){
		selectedRow=row;
		selectedCell=Row.getCell(row,currentCoulmType,null);
		// the cell bay be empty
		selectedNode=(selectedCell)?selectedCell.node:null;		
	} else {
		selectedRow=null;
		selectedCell=null;
		selectedNode=null;
//		$(document).trigger("trlg:selection-changed",[null,null,null,null]);		
	}

	$(document).trigger("trlg:selection-changed",[selectedNode,selectedRow,selectedCell,currentCoulmType]);

};

SINGLETON.listenOnSelectionChanged=function(f){
	if ($.isFunction(f)){
		$(document).on("trlg:selection-changed",f);
	}	
};


SINGLETON.getSelectedColumnType=function(){
	return Store.getColumnType();
};

SINGLETON.setSelectedColumnType=function(columnType){
	var value=Store.setColumnType(columnType,null);
	
	if (value){		
		if (selectedRow){
			selectedCell=Row.getCell(selectedRow,value,null);
			if (selectedCell){
				selectedNode=selectedCell.node;
			} else {
				selectedNode=null;
			}
		} else {
			selectedCell=null;
			selectedNode=null;
		}
		$(document).trigger("trlg:columnType-changed",[selectedNode,selectedRow,selectedCell,value]);
	}
};

SINGLETON.listenOnColumnTypeChanged=function(f){
	if ($.isFunction(f)){
		$(document).on("trlg:columnType-changed",f);
	}	
};


SINGLETON.setSelectedNode=function(node){
	if (node){
		selectedRow=Node.getRow(node,null);
		selectedCell=Row.getCell(selectedRow,SINGLETON.getSelectedColumnType(),null);
		selectedNode=node;
	} else {
		selectedRow=null;
		selectedCell=null;
		selectedNode=null;

	}

	$(document).trigger("trlg:selection-changed",[selectedNode,selectedRow,selectedCell,SINGLETON.getSelectedColumnType()]);

};

function setNode(f,columnType){
	var currentColumnType=validateColumnType(columnType,SINGLETON.getSelectedColumnType());
	
	var node;
	if (selectedNode) {
		node=(f.bind(Node))(selectedNode,selectedNode);
	} else {
		node=Store.getRoot(currentColumnType);
	}

	SINGLETON.setSelectedNode(node);	
}


SINGLETON.selectPrevNode=function(columnType){
	setNode(Node.prevNode,columnType);
};

SINGLETON.selectNextNode=function(columnType){
	setNode(Node.nextNode,columnType);
};

SINGLETON.selectParentNode=function(columnType){
	setNode(Node.parentNode,columnType);
};

SINGLETON.selectChildNode=function(columnType){
	setNode(Node.childNode,columnType);
};

function moveNode(f){
	if (selectedNode) {
		// Store.moveDown(selectedNode);
		(f.bind(Store))(selectedNode);
		SINGLETON.setSelectedNode(selectedNode);
	}
}

SINGLETON.selectMoveDown=function(){
	moveNode(Store.moveDown);
};

SINGLETON.selectMoveUp=function(){
	moveNode(Store.moveUp);
};

SINGLETON.selectMovePrev=function(){
	moveNode(Store.movePrev);
};

SINGLETON.selectMoveNext=function(){
	moveNode(Store.moveNext);
};

//
// Reload
//



module.exports=SINGLETON;
