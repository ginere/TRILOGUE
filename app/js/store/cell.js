/**
 * Use this to dealing row cells
 */
'use strict';

console.log("Loading file:cell.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */

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


