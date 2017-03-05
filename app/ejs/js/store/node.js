/**
 * Node this hahdle the nodes of a tree
 */
'use strict';
<% var currentName="node"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var error = require('../lib/error');

var GP = require('../lib/GlobalProperties.js');
var Roman = require('../lib/roman.js');

var Row = require('../store/row.js');

var SINGLETON={};


//
// Tree leaf example.
//  - rowId: The id of the row and can be null. The row can be obtained throug
//		the row cache in the row class
//  - The node is associated to a cell in the row
//
// {
// 	"level":0,
// 	"parent":null,
// 	"childs":[],
// 	"title":"This is the title",
// 	"rowId":id
// }];
//
//
// 
//

/**
 * this create a leaf, low level
 */
function create(level,parent,title,rowId){
	return {
		level:level,
		parent:parent,
		title:title,
		rowId:rowId,
		childs:[],
		next:null,
		prev:null
	};
}


/**
 * Getin automatly the title from the node level in the tree
 * and the order into the parent
 */
function getTitle(level,order){
	if (level === 0){
		return GP.get("DEFAULT_TABLE_TITLE","");
	} else if (level === 1){
		return "TITLE "+Roman.romanize(order+1);
		
	} else if (level === 2){
		return "Article "+(order+1);
		
	} else if (level === 3){
		return ""+(order+1)+". ";
		
	} else if (level === 4){
		return "("+String.fromCharCode("a".charCodeAt(0)+order)+") ";
		
	} else {
		return " - ";
		// return "("+level+","+order+")" ;		
	}
}

SINGLETON.getTitle=getTitle;

/**
 * Ath the child at the end
 */
function addChild(parent,child){
	child.level=parent.level+1;
	child.parent=parent;
	child.title=getTitle(parent.level+1,parent.childs.length);
	
	var prev=(parent.childs.length>0)?parent.childs[parent.childs.length-1]:null;

	child.prev=prev;
		
	if (prev){
		prev.next=child;
	}
	parent.childs.push(child);
	
	return child;		
	
}

SINGLETON.createRoot=function(title){
	return create(0,null,title,null);
};

SINGLETON.createChild=function(parent){
	if (!parent){
		log.error("Passing null parent");
		return null;
	} else {
//		var order=parent.childs.length;
		var child=create(parent.level+1,parent,getTitle(parent.level+1,parent.childs.length),null);

		var prev=(parent.childs.length>0)?parent.childs[parent.childs.length-1]:null;

		child.prev=prev;
		
		if (prev){
			prev.next=child;
		}
		parent.childs.push(child);

		return child;		
	}
};

SINGLETON.setRow=function(node,rowId){
	if (node){
		node.rowId=rowId;
	}
};

SINGLETON.getRow=function(node,defaultValue){
	if (node && node.rowId){
		return Row.get(node.rowId,null);				
	} else {
		return defaultValue;
	}
};

SINGLETON.getCell=function(node,columnType,defaultValue){
	var row=SINGLETON.getRow(node,null);
	if (row === null){
		return defaultValue;
	} else {
		return Row.getCell(row,columnType,null);
	}
};


/**
 * Iterate over a child.
 *  var ret=f(root,row,cell,columnType); 
 *  If the iterator function f return not null the iteration
 * is stopped and the value is returned.
 *
 */
function iteratePreOrder(root,f,columnType){
	if (root){		
		var row=SINGLETON.getRow(root,null);				
		var cell=Row.getCell(row,columnType,null);
		
		var ret=f(root,row,cell,columnType); 

		if (ret){
			return ret;
		} else {
			$.each(root.childs,function(index,child){
				ret=iteratePreOrder(child,f,columnType);

				if (ret){
					return ret;
				}
			});
		}
	}
}

/**
 * Tree iterate from top to down from First to last child.
 * Root node always first.
 * The current node is passed to the iterator function f. If this function return differnt
 * from null or undefined the iteration stop and the value is returned.
 */
SINGLETON.iteratePreOrder=function(root,f,columnType){
	if ($.isFunction(f) && root){
		return iteratePreOrder(root,f,columnType);
	}	
};

/**
 * Iterate over a child.
 *  var ret=f(root,row,cell,columnType); 
 *  If the iterator function f return not null the iteration
 * is stopped and the value is returned.
 *
 */
function iterateRootLast(root,f,columnType){
	if (root){
		// childs first
		$.each(root.childs,function(index,child){
			var ret=iterateRootLast(child,f,columnType);

			if (ret){
				return ret;
			}
		});

		// root last
		
		var row=SINGLETON.getRow(root,null);				
		var cell=Row.getCell(row,columnType,null);
		
		var ret=f(root,row,cell,columnType); 
		
		return ret;
	}
}


/**
 * Iterate first the child and then the root
 */
SINGLETON.iterateRootLast=function(root,f,columnType){
	if ($.isFunction(f) && root){
		return iterateRootLast(root,f,columnType);
	}
	
};


SINGLETON.prevNode=function(node,defaultV){
	if (node){
		if (node.prev){
			return node.prev;
		} if (node.parent){
			return node.parent;
		}
	}

	return defaultV;
};

SINGLETON.nextNode=function(node,defaultV){
	if (node){
		if (node.next){
			return node.next;
		} if (node.parent){
			return SINGLETON.nextNode(node.parent,defaultV);
		}
	}
	return defaultV;
};

SINGLETON.parentNode=function(node,defaultV){
	if (node && node.parent){
		return node.parent;
	} else {
		return defaultV;
	}
};

SINGLETON.childNode=function(node,defaultV){
	if (node && node.childs && node.childs.length>0){
		return node.childs[0];
	} else {
		return defaultV;
	}	
};

/**
 * This find the child into the array 
 * gining back the index. To finc the child 
 * we use the rowId. To nodes are equal if the have te same row Id
 */
function finchChildIndex(array,child){
	var ret=0;
	
	$.each(array,function(index,element){
		if (element.rowId === child.rowId){
			ret=index;
			// verify this breaks ....
			return ret;
		}
	});

	return ret;
}

/**
 * When childs are added or removed the titles and the 
 * level should be regenerated.
 */
function rebuild(node){
	$.each(node.childs,function(index,child){
		child.level=node.level+1;
		child.title=getTitle(child.level,index);
		rebuild(child);
	});

}

SINGLETON.moveDown=function(node){
	if (node && node.prev){
		var newParent=node.prev;
		newParent.next=node.next;
		
		if (node.next){
			node.next.prev=newParent;
		}

		node.prev=node.next=null;

		var index=finchChildIndex(node.parent.childs,node);

		// removing
		node.parent.childs.splice(index,1);
		
		addChild(newParent,node);

		rebuild(newParent.parent);
	}

	return node;
};



/**
 * Moving the node as the next child on the parent if any.
 * If the parent is the root the node can not be moved to the top.
 */
SINGLETON.moveUp=function(node){
	// If the parent is the root this node can not be moved to the top.
	if (node && node.parent  && node.parent.parent){
		// The new definitions
		var brother=node.parent;
		var newParent=node.parent.parent;

		// remove from the current parent
		var parentIndex=finchChildIndex(node.parent.childs,node);
		node.parent.childs.splice(parentIndex,1);
		
		// insert the node after the new brother.
		var brotherIdex=finchChildIndex(newParent.childs,brother);

		// inserting the new element
		newParent.childs.splice(brotherIdex+1, 0, node);

		// setting the links
		if (brother.next){
			brother.next.prev=node;
		} 
		node.next=brother.next;
		node.prev=brother;
		brother.next=node;

		// Setting the level and other 
		node.level=brother.level;
		node.parent=newParent;

		node.title=getTitle(node.level,brotherIdex+1);

		rebuild(newParent);
	}

	return node;
};

/**
 * This swap the position of 2 consecutive chils.
 *  [ ....,a,b,....]
 */
function swap(a,b){
	var node=b;
	var prev=node.prev;
	var next=node.next;
	
	var index=finchChildIndex(node.parent.childs,prev);
		
	node.parent.childs[index]=node;
	node.parent.childs[index+1]=prev;

	if (prev.prev!=null){
		prev.prev.next=node;			
	}
	node.prev=prev.prev;
	node.next=prev;
	prev.prev=node;
	prev.next=next;
	
	rebuild(node.parent);	
}

SINGLETON.movePrev=function(node){
	if (node && node.prev){
		swap(node.prev,node);
	}	
};

SINGLETON.moveNext=function(node){
	if (node && node.next){
		swap(node,node.next);
	}	
};


module.exports=SINGLETON;

