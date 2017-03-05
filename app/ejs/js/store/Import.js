/**
 * This is the Main Store
 */
'use strict';
<% var currentName="Selection"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var $ = require('jquery');
var $q = require('q');

var log = require('../lib/log');
var Error = require('../lib/error');

var Store = require('../store/Store');
var Node = require('../store/node');
// var T = require('../lib/transform');


var SINGLETON={};

SINGLETON.import=function(text){
	if (!text){
		return;
	} else {
		var array = text.split("\n");

		log.info("Importing:"+array.length);

		Store.importStringArray(array);
	}	
};

function store (nodes,rows){
	localStorage.setItem("nodes",nodes);
	localStorage.setItem("rows",rows);	
}

SINGLETON.save=function(){
	alert("Save");
	
	var root=Store.getRoots();
	
	var jsonNodes=JSON.stringify( root, function( key, value) {
		
		console.log("Key:"+key);
		console.log("Value:");
		console.log(value);
		
		if( key === 'next') {
			return ;
		} else if( key === 'prev') {
			return ;
		} else if( key === 'level') {
			return ;
		} else if( key === 'title') {
			return ;
		} else if( key === 'parent') {
			return ;
		} else if( key === 'childs') {
			if (value && value.length && value.length>=1){
				return value;
			} else {
				return ;
			}
		} else {
			return value;
		}
	},2);

	log.info(jsonNodes);

	var rows=Store.getRows();
	var jsonRows=JSON.stringify( rows, function( key, value) {
		console.log("Key:"+key);
		console.log("Value:");
		console.log(value);

		if( key === 'node') {
			return ;
		} else {
			return value;
		}
		
	},2);
		
	// Save the rows ...
	log.info(jsonRows);

	store(jsonNodes,jsonRows);
	
};

function rebuildNode(cache,columnType,node,parent,order,prev){
	node.parent=parent;

	if (parent){
		node.level=parent.level+1;
	} else {
		node.level=0;
	}

	node.title=Node.getTitle(node.level,order);
	node.prev=prev;
	if (node.prev){
		node.prev.next=node;
	}
	node.next=null;

	// setting the cell;
	if (node.rowId){
		var row=cache[node.rowId];
		if (row){
			if (row[columnType]){
				row[columnType].node=node;
			} else {
				log.warn(node.rowId);
				row[columnType]={node:node};
			}
		}
	}
	// iterating on childs
	if (node.childs) {
		if (node.childs.length>0){
			var currentPrev=null;
			$.each(node.childs,function(index,value){
				rebuildNode(cache,columnType,value,node,index,currentPrev);
				currentPrev=value;
			});
		}
	} else {
		node.childs=[];
	}
	
}

SINGLETON.load=function(){
	var nodes=localStorage.getItem("nodes");
	var rows=localStorage.getItem("rows");

	if (nodes && rows){
		var cache=JSON.parse(rows);
		var roots=JSON.parse(nodes);

		$.each(roots,function(key,value){
			var columnType=key;
			rebuildNode(cache,columnType,value,null,0,null);
		});

		debugger;
		
		Store.setRoots(roots,cache);
	}
	
	
};

module.exports=SINGLETON;

