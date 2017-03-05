/**
 * This is the Main Store
 */
'use strict';

/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */


var $ = require('jquery');
var $q = require('q');

var log = require('../lib/log');
var Error = require('../lib/error');

var RowId = require('../store/rowId');
var Row = require('../store/row');
var Node = require('../store/node');


var SINGLETON={};


//
// Cell Data Example.The cell Id is unique
//
// var data=[{
// 	"id":1,
// 	"ec":"text1",
// 	"ep":"text2",
// 	"ceu":"text3",
// 	"agreement":"text4"
//
// }];
//

// var table=[];

var columns=[
	{id:"ec",name:"Comission Proposal"},
	{id:"ep",name:"EP Mandate"},
	{id:"ceu",name:"Council Mandate"}
];

var columnHash={};
$.each(columns,function(index,columnDef){
	columnHash[columnDef.id]=columnDef;
});


// The current column
var currentColumnType=columns[0].id;



// The root nodes for each column type
var root={};

var DEFAULT_DOCUMENT_NAME="Document";

function createTreeRoot(title){

	root={};
	$.each(columns,function(index,columnDef){
		root[columnDef.id]=Node.createRoot(title);
	});		
}


function trigggerTableReloaded(){
	$(document).trigger("trlg:reloaded");
}


SINGLETON.getRoot=function(columnType){
	return root[SINGLETON.validateColumnType(columnType,currentColumnType)];
};

SINGLETON.getRoots=function(){
	return root;
};

SINGLETON.setRoots=function(_roots,rows){
	Row.setRows(rows);
	root=_roots;

	trigggerTableReloaded();
};

SINGLETON.getRows=function(){
	return Row.getRows();
};


// SINGLETON.getDefaultColumnType=function(){
// 	return columns[0].id;
// };


SINGLETON.setTable=function(_table){
	if (_table && $.isArray(_table)){
		RowId.init();
		
		Row.init();
		
		// create the root for each column
		createTreeRoot(DEFAULT_DOCUMENT_NAME);
		
		// iterate on all the tableRows to create the trilogue rows
		$.each(_table,function(index,tableRow){
			// Create a row using the ID from the tableRow or creating a new one if no id in the tableRow
			var row=Row.createInstance(RowId.get(tableRow));

			log.info("Created rowId"+row.id);
			
			// for each column definition, generate a cell. IF no cell create an empty one
			$.each(columns,function(index,columnDef){
				// Getting a child node associated to the parent node of the definition.
				var node=Node.createChild(root[columnDef.id]);

				// passing the node
				Row.addColumn(row,columnDef.id,tableRow[columnDef.id],node);

				Node.setRow(node,row.id);
			});

		});

		// setting the initial values
		// currentColumnType=columns[0].id;

		// triger the event
		trigggerTableReloaded();
	}

	return ;
};



SINGLETON.importStringArray=function(_table,documentName,columnType){
	if (_table && $.isArray(_table)){

		// Initialize the IDs
		RowId.init();		
		Row.init();
		
		// create the root for each columnType
		createTreeRoot((documentName)?documentName:DEFAULT_DOCUMENT_NAME);

		// Get the selectoed column type to insert the data into that column
		var validatedColumnType=SINGLETON.validateColumnType(columnType,currentColumnType);
		
		// iterate on all the tableRows to create the trilogue rows
		$.each(_table,function(index,text){

			// If not text do not import that line
			if (text){
				
				// Create a row Generating the new row
				var row=Row.createInstance(RowId.generateId());

				log.info("Created rowId"+row.id);

				debugger;
				// Generateting cell for each column
				$.each(columns,function(index,columnDef){

					var node=Node.createChild(root[columnDef.id]);

					if (columnDef.id === validatedColumnType){
						
						// passing the node
						Row.addColumn(row,columnDef.id,text,node);
					} else {
						Row.addColumn(row,columnDef.id,"",node);						
					}

					Node.setRow(node,row.id);
				});
			}
		});
				
		// triger the event
		trigggerTableReloaded();
	}

	return ;
};


SINGLETON.loadJsonTable=function(url){
	if (!url){
		return Error.reject("The url passed in parameter is empty");
	} else {
		return $q(
			$.ajax({url:url})
		).then(function(response){

			return SINGLETON.setTable(response);
			
		}).catch(function(err){
			return Error.reject("While calling url:"+url,err);
		});
	}
};

/**
 * This validates de columns type
 */
SINGLETON.validateColumnType=function(columnType,defaultValue){
	if (columnType && columnHash[columnType]){
		return columnType;
	} else {
		return defaultValue;
	}
};

SINGLETON.getColumnType=function(){
	return currentColumnType;	
};

SINGLETON.setColumnType=function(columnType,defaultValue){
	if (currentColumnType === columnType){
		return defaultValue;
	} else if (columnType && columnHash[columnType]){
		currentColumnType=columnType;
		return currentColumnType;
	} else {
		return defaultValue;
	}
};

SINGLETON.getColumnFromNode=function(node,columnType,defaultValue){
	return Node.getCell(node,columnType,defaultValue);
};


SINGLETON.getCellFromRowId=function(rowId,defaultValue,columnType){
	var validatedColumnType=SINGLETON.validateColumnType(columnType,currentColumnType);
	
	return Row.getCellFromRowId(rowId,validatedColumnType,defaultValue);
};

SINGLETON.getColumnsTypes=function(){
	return columns;
};


/**
 * Use the function to iterte. See node.iteratePreOrder
 */
SINGLETON.iterateRootFirst=function(f,columnType){

	if (columnType && root[columnType]){
		return Node.iteratePreOrder(root[columnType],f,columnType);
	} else {
		return Node.iteratePreOrder(root[currentColumnType],f,currentColumnType);
	}
};

/**
 * Use the function to iterate. See node.iterateRootLast
 */
SINGLETON.iterateRootLast=function(f,columnType){

	if (columnType && root[columnType]){
		return Node.iterateRootLast(root[columnType],f,columnType);
	} else {
		return Node.iterateRootLast(root[currentColumnType],f,currentColumnType);
	}
};

SINGLETON.listenOnTableReloaded=function(f){
	if ($.isFunction(f)){
		$(document).on("trlg:reloaded",f);
	}
};

function trigggerChanged(){
	$(document).trigger("trlg:tree-changed");
}

SINGLETON.listenOnChange=function(f){
	if ($.isFunction(f)){
		$(document).on("trlg:tree-changed",f);
	}
};

function move(f,node){
	(f.bind(Node))(node);
	trigggerChanged();
	return node;
}

SINGLETON.setValue=function(rowId,text,columnType){

	var row=Row.get(rowId,null);
	if (row) {
		var validatedColumnType=SINGLETON.validateColumnType(columnType,currentColumnType);
		var cell=Row.getCell(row,validatedColumnType,null);
		if (cell){
			if (cell.text!==text) {
				cell.text=text;
				$(document).trigger("trlg:cell-changed",
									[cell.node,row,cell,validatedColumnType]);
				return text;
			}
		}
	}

	return null;
};

SINGLETON.listenOnCellChanged=function(f){
	if ($.isFunction(f)){
		$(document).on("trlg:cell-changed",f);
	}
};


// SINGLETON.getValue=function(rowId,defaultvalue){
// 	var cell=SINGLETON.getCellFromRowId(rowId);
// 	if (cell){
// 		if (cell.text){
// 			return cell.text;
// 		}
// 	}
// 	return defaultvalue;
// };

SINGLETON.getValue=function(rowId,defaultvalue,columnType){
	var cell=SINGLETON.getCellFromRowId(rowId,columnType);
	if (cell){
		if (cell.text){
			return cell.text;
		}
	}
	return defaultvalue;
};


SINGLETON.moveDown=function(node){
	move(Node.moveDown,node);
};

SINGLETON.moveUp=function(node){
	move(Node.moveUp,node);
};


SINGLETON.movePrev=function(node){
	move(Node.movePrev,node);
};

SINGLETON.moveNext=function(node){
	move(Node.moveNext,node);
};

module.exports=SINGLETON;
