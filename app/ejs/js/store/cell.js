/**
 * Use this to dealing row cells
 */
'use strict';
<% var currentName="cell"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var $ = require('jquery');

var SINGLETON={};

// a cell is like:
// {
// 	text:" Ipsum lardum, etc ...",
// 	node: node
// }

SINGLETON.createInstance=function(text,node){
	var cell = {text:text,node:node};

	return cell;
};

// SINGLETON.setText=function(cell,text){
// 	if (cell){
// 		cell.text=text;
// 	}
// };


module.exports=SINGLETON;


