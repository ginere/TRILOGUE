/**
 * Use this to dealing rows. This also have a row cache.
 */
'use strict';

console.log("Loading file:row-2.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

var $ = require('jquery');

var log = require('../lib/log');
var error = require('../lib/error');

var RowId = require('../store/rowId');
var Cell = require('../store/cell');
//var Node = require('../store/node');

var SINGLETON={};

// a row is like:
// {
// 	id:id,
// 	ep: cell,
//  ceu:ceu,
// }

var cache={};

SINGLETON.init=function(){
	cache={};
};

SINGLETON.getRows=function(){
	return cache;
};

SINGLETON.setRows=function(rows){
	cache=rows;
};

SINGLETON.add=function(row){
	if (!row || !row.id){
		return null;
	} else {
		// Store the row into the hash map
		cache[row.id]=row;

		return row;
	}
};

SINGLETON.get=function(rowId,defaultValue){
	if (!rowId || !cache[rowId]){
		return defaultValue;
	} else {
		return cache[rowId];
	}
};

SINGLETON.getCellFromRowId=function(rowId,columnType,defaultValue){
	var row=SINGLETON.get(rowId,null);
	if (row){
		return SINGLETON.getCell(row,columnType,defaultValue);
	} else {
		return defaultValue;
	}
};

SINGLETON.getCell=function(row,columnType,defaultValue){
	if (!row || !columnType || ! row[columnType]){
		return defaultValue;
	} else {
		return row[columnType];
	}
};

/**
 * Create a new instance and store in the cache.
 */
SINGLETON.createInstance=function(id){
	var row;
	if (id){
		row={id:id};
	} else {
		row={id:RowId.generateId()};
	}
	return SINGLETON.add(row);
};

SINGLETON.addColumn=function(row,columnId,text,node){
	if (row && columnId){
		row[columnId]=Cell.createInstance(text,node);
	}
	
	return row;
};


module.exports=SINGLETON;


