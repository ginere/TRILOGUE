 /**
 * This hanld the Tree Overlay widget
 */
'use strict';

console.log("Loading file:grid.js ...");/*global document:false, sessionStorage: false, console: false, alert: false, $: false, window: false, jQuery:false,  location:false, debugger:false, navigator:false, localStorage:false */


var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/error');

var Widget = require('../lib/widget');
var Scroll = require('../lib/scroll-to');
var Display = require('../lib/display');

var Store = require('../store/Store');
var Selection = require('../store/Selection');

var Editor = require('../widget/editor.js');

var JsDiff = require('diff');

var SINGLETON={};

SINGLETON.id="grid";
SINGLETON.template="<table id=\"table\" cellspacing=\"0\" width=\"100%\" class=\"dt-bootstrap table table-striped table-bordered table-hover\"><thead><tr><th id=\"id\"></th><th id=\"ec\" class=\"text-center\"> Commission Proposal</th><th id=\"ep\" class=\"text-center btn-default\"> EP Mandate</th><th id=\"ceu\" class=\"text-center\">Council Mandate</th><th id=\"agreement\" class=\"text-center\">Agreement</th></tr></thead></table>";
SINGLETON.table=null;

var doDiffing=false;
/**
 * Subscriving events ...
 */
SINGLETON.documentReady=function(){
	
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
		
		// displaySelection();
		
		$(document).trigger("trlg:widget-visivility-changed",SINGLETON.opened);
	}
};


SINGLETON.display=function(){
	var data={
		columns:Store.getColumnsTypes()
	};
	var content=Display.render(SINGLETON.id,data);

	return content;
};

function reload(){
	if (SINGLETON.table){
		// tree change
		// SINGLETON.table.data=generateData();
		// https://datatables.net/reference/api/rows().remove()
		
		// SINGLETON.table.rows().remove().data(generateData()).draw();
		SINGLETON.table.rows().remove();

		Store.iterateRootFirst(function(node,row,cell,columnType){
			if (row){
				SINGLETON.table.row.add(row);
			}
		},Store.getColumnType());
		SINGLETON.table.draw();
		
		//SINGLETON.table.data=[];
		// SINGLETON.table.draw(true);
	}
}

SINGLETON.documentReady=function(){
	Store.listenOnTableReloaded(function(event){
		reload();
	});
	
	Store.listenOnChange(function(event){
		reload();
	});

	Selection.listenOnColumnTypeChanged(function(event,node,row,cell,columnType){
		// $( SINGLETON.table.column( 1 ).nodes() ).addClass( 'selected' );
		$("thead").removeClass();
		$("thead").addClass(columnType);
		reload();
	});

	Store.listenOnCellChanged(function(event,node,row,cell,columnType){
		if (SINGLETON.isOpen()){
			if (row && row.id && cell && columnType) {

				// THis only redraw the column we shoud redraw the entire cell
				// or at least the agrrement ...
				
				// var el=$("#"+row.id+'-'+columnType);
				// var tableCell = SINGLETON.table.cell( el.parent() );
				// tableCell.data( cell ).draw();


				// invalidate and redraw the entire row
				var indexes = SINGLETON.table.rows().eq(0).filter( function (rowIdx) {
					
					return SINGLETON.table.cell( rowIdx, 0 ).data() === row.id ? true : false;
				} );
				debugger;
				
				SINGLETON.table.rows( indexes ).invalidate();
				
				
			 	// updateCellValue(row.id,cell.text);

				// var cell = table.cell( this );
				// cell.data( cell.data() + 1 ).draw();
			}
		}
	});


	Selection.listenOnSelectionChanged(function(event,node,row,cell){
		// Change the selection
		if (row && SINGLETON.isOpen()){
			log.info(row.id);

			// clear selection

			$("#table tr.selected").removeClass('selected');
			
			// Find indexes of rows which have `Yes` in the second column
			var indexes = SINGLETON.table.rows().eq(0).filter( function (rowIdx) {
				return SINGLETON.table.cell( rowIdx, 0 ).data() === row.id ? true : false;
			} );

			var element=SINGLETON.table.rows( indexes )
				.nodes()
				.to$();
			
			element.addClass( 'selected' );
			
//			var tableRow = SINGLETON.table.row(row.id);
			
			// tableRow.select();

//			$(tableRow).toggleClass('selected');
			
			//var tableRow = SINGLETON.table.row(1);
			//$(tableRow).addClass("selected");
			
			// clearSelection();

			// if (row){
			// 	setSelection(row.id);
			// }

			// TODO: CHANGE PAGE
			Scroll.to(element);
			
		}
	});

	$(document).on("click","#grid .editable",function(event){
		var column=SINGLETON.table.column( $(event.currentTarget).index()+':visIdx' );
		var columnId=$(this).data("col");
		if (columnId){
			// Selection.setSelectedColumnType(columnId);
			var rowId=$(this).data("row");
			Editor.open(rowId,$(this),columnId);
		}
		
	});

};

function initTable(_table){
	SINGLETON.table=_table;

}

function generateData(){
	var ret=[];

	// https://datatables.net/release-datatables/examples/data_sources/js_array.html
	Store.iterateRootFirst(function(node,row,cell,columnType){
		if (row){
			ret.push(
				row
			);
		}
	},Store.getColumnType());

	return ret;
}

function drawCell(col){  // meta: information about the row,column possition, etc ...

	return function(cell, type, row, meta ){
		// maybe the cell is not defined
		var cellNodeItle,cellText;
		if (cell){
			if (cell.text){
				cellText=cell.text;
			} else {
				cellText="&nbsp;&nbsp;&nbsp;";
			}
			cellNodeItle=cell.node.title;
		} else {
			cellText="&nbsp;&nbsp;&nbsp;";
			cellNodeItle="";
		}
		return '<span><b>'+cellNodeItle+'</b></span><div id="'+row.id+'-'+col+'" data-row="'+row.id+'" data-col="'+col+'" class="editable">'+cellText+'</div>';
	};
}

function displayTable(el){
	el=$("#table");
	el.DataTable({
		data: generateData(),
		"columns": [{ 
			"data":"id",
			"className":"dt-right",
			"width": "1%",
			"type": "num",
			"searchable":true,
			"orderable":true,
			"visible":true 			
		},{
			"data":"ec",
			"type": "string",
			"searchable":true,
			"orderable":false,
			"width": "25%",
			"className":"dt-left",
			render:drawCell('ec')
		},{
			"data":"ep",
			"type": "string",
			"searchable":true,
			"orderable":false,
			"width": "25%",
			"className":"dt-left",
			render:drawCell('ep')
		},{
			"data":"ceu",
			"type": "string",
			"searchable":true,
			"orderable":false,
			"width": "25%",
			"className":"dt-left",
			render:drawCell('ceu')
		},{
			"data":"agreement",
			"type": "string",
			"searchable":true,
			"orderable":false,
			"width": "24%",
			"className":"dt-left",
			render:function(currentValue, type, row, meta ){
				if (doDiffing && row.ep.text !== row.ceu.text){
					var diff=JsDiff.diffWords(row.ep.text, row.ceu.text);
					row.agreement=diff;
					
					if (diff) {
						var ret="";
						diff.forEach(function(part){
							// green for additions, red for deletions
							// grey for common parts
							var color = part.added ? '#00a500' : 
								part.removed ? 'red' : 'grey';

							if (part.added) {
								ret+='<span style="font-weight: bold;color:'+color+'">'+part.value+'</span>';
							} else if (part.removed) {
								ret+='<span style="font-weight: bold;text-decoration:line-through; color:'+color+'">'+part.value+'</span>';								
							} else {
								ret+=part.value;								
							}
						});
						return ret;
					}
				} 
				return "";
			}			
		}]			
		,"order": [[ 0, "asc" ]]
		, "dom": "<'#table-header'>" +
			"<'row'<'col-sm-3'l><'col-sm-3'i><'col-sm-3'p><'col-sm-3'f>>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row'<'col-sm-5'i><'col-sm-7'p>>"
		
		, colReorder: true
		, reponsive:true
		, iDisplayLength: 10
 		, "lengthMenu": [[10, 25, 50, 100, 1000, -1], [10, 25, 50, 100, 1000, "All"]]

		,"initComplete": function () {
			var _table = this.api();
			initTable(_table);

		}
//		,ajax:loadData()

	});	
}

SINGLETON.switchDoDiffing=function(){
	debugger;
	doDiffing=!doDiffing;
	
//	SINGLETON.table.draw();

	reload();
};

/**
 * Creates the widget with the rented function.
 */
var WIDGET=new Widget(function(el){
	// Display the table header
	el.html(SINGLETON.display());

	// display the table
	displayTable(el);

	$("thead").addClass(Selection.getSelectedColumnType());
},"#grid",true);



/**
 * Merges both documents
 */
SINGLETON=$.extend(WIDGET,SINGLETON);


module.exports=SINGLETON;

