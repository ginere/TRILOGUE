/**
 * This is the main application entry point
 */
'use strict';
<% var currentName="Application"; %>
<%- include('./snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var $ = require('jquery');
var $q = require('q');

var log = require('./lib/log');
var Error = require('./lib/error');

var Store = require('./store/Store');
var Selection = require('./store/Selection');

var Tree = require('./widget/tree');
var Con = require('./widget/consolidated');
var Grid = require('./widget/grid');

var Import = require('./widget/import');
var Editor = require('./widget/editor');
var Menu = require('./widget/menu');

var KeyboardEvents=require('./lib/KeyboardEvents');

var DOC1=require('./data/doc2');

var SINGLETON={};


SINGLETON.init=function(){
	log.info("Application initialization ...");

	return $q.all([Store.setTable(DOC1),
				   
				   Con.init(),
				   Grid.init(),
				   Tree.init(),
				   
				   Import.init(),
				   
				   Editor.init(),
				   Menu.init()
				  ]).catch(function(err){
					  // return Error.reject("Error Initializationg the application",err);
					  log.error(err);
				  });
};


SINGLETON.documentReady=function(){

	log.info("Document ready ...");
	
	Con.documentReady();
	Grid.documentReady();
	Tree.documentReady();

	Import.documentReady();

	Editor.documentReady();
	
	Menu.documentReady();

	// The keyboard events
	KeyboardEvents.ready();


	// LEFT
	KeyboardEvents.shorcut(37,false,function(event){
		log.info("Left");
		Selection.selectParentNode();
		event.preventDefault();
		event.stopPropagation();
	});

	// RIGHT
	KeyboardEvents.shorcut(39,false,function(event){
		log.info("Right");
		Selection.selectChildNode();
		event.preventDefault();
		event.stopPropagation();
	});

	// UP
	KeyboardEvents.shorcut(38,false,function(event){
		log.info("Up");
		Selection.selectPrevNode();
		event.preventDefault();
		event.stopPropagation();
	});

	// DOWN ?
	KeyboardEvents.shorcut(40,false,function(event){
		log.info("Down");
		Selection.selectNextNode();
		event.preventDefault();
		event.stopPropagation();
	});


	// SHITF-LEFT
	KeyboardEvents.shorcut(37,true,function(event){
		log.info("ALT-LEFT");
		Selection.selectMoveUp();
		event.preventDefault();
		event.stopPropagation();
	});


	// SHIFT-RIGHT
	KeyboardEvents.shorcut(39,true,function(event){
		log.info("ALT Right");
		Selection.selectMoveDown();

		event.preventDefault();
		event.stopPropagation();
	});

	// SHIFT-UP
	KeyboardEvents.shorcut(38,true,function(event){
		log.info("Alt Up");
		Selection.selectMovePrev();
		event.preventDefault();
		event.stopPropagation();
	});

	// SHIFT-DOWN ?
	KeyboardEvents.shorcut(40,true,function(event){
		log.info("Alt Down");
		Selection.selectMoveNext();
		event.preventDefault();
		event.stopPropagation();
	});



	KeyboardEvents.shorcut(84,false,function(event){ // T
		if (Tree.switch()){
			KeyboardEvents.default(Tree.handleEvent);
		} else {
			KeyboardEvents.default(Con.handleEvent);
		}
	});

	KeyboardEvents.shorcut(71,false,function(event){ // G
		if (Grid.isOpen()){
			Grid.close();
			Con.open();
			Import.close();
		} else {
			Con.close();
			Grid.open();
			Import.close();
		}
	});

	KeyboardEvents.shorcut(73,false,function(event){ // I
		Import.switch();

		if (Import.isOpen()){
			Grid.close();
			Con.close();
		} else {
			Con.close();
			Grid.open();
		}
	});

	// DIFF
	KeyboardEvents.shorcut(68,false,function(event){
		Grid.switchDoDiffing();
		event.preventDefault();
		event.stopPropagation();
	});


	$(document).on("trlg:widget-change-visivility",function(event,view){
		if (view === "tree"){
			Tree.switch();
		}
		if (view === "grid"){
			Grid.switch();
			Con.switch();
			Import.close();
		}

		if (view === "consolidated"){
			Grid.switch();
			Con.switch();
			Import.close();
		}

		if (view === "import"){			
			Import.switch();
			
			if (Import.isOpen()){
				Grid.close();
				Con.close();
			} else {
				Con.close();
				Grid.open();
			}
		}

		if (view === "save"){
			Import.save();
		}

		if (view === "load"){
			Import.load();
		}

	});

	Tree.listenOnVisivilityChanged(function(event,visible){
		Menu.setVisible("#tree-btn",Tree.isOpen());
		Menu.setVisible("#consolidated-btn",Con.isOpen());
	 	Menu.setVisible("#grid-btn",Grid.isOpen());
		
	 	Menu.setVisible("#import-btn",Import.isOpen());
	});

	if (Import.isOpen()){
		KeyboardEvents.default(Import.handleEvent);
	} else {
		if (Tree.isOpen()){
			KeyboardEvents.default(Tree.handleEvent);
		} else {
			KeyboardEvents.default(Con.handleEvent);
		}
	}

};


/**
 * The render entry point
 */
SINGLETON.render=function(){
	log.info("Application rendering ...");

	Menu.render();

	Tree.render("#tree");
	Con.render("#consolidated");
	Grid.render("#grid");

	Import.render("#import");

	Tree.close();
	Tree.open();
};

module.exports=SINGLETON;
