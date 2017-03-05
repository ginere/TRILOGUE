/**
 * This scroll the window to see a element.
 */
'use strict';
<% var currentName="GlobalProperties"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var log = require('../lib/log');

var SINGLETON={};

var DEFAULT_SCROLL_SPEED=20;

// if this retuns 0 the element is inside the scroll and dont have to be scrolled
SINGLETON.getVerticalDistance=function(el){	
	if (el){
		var e=$(el);
		var win=$(window);
		var top = win.scrollTop();
		var height=win.height();

		var offset = e.offset();
		var etop=offset.top;
		var eHight=e[0].offsetHeight;

		var bottom = top + height;

		// log.info( "etop:"+etop+
		// 		  " top:"+top+
		// 		  " elbot:"+(etop+eHight)+
		// 		  " bottom:"+bottom+
		// 		  "");
		if ( etop < top ||						 
			 (etop+eHight) > bottom){
			
			// element center
			var ec=etop+(eHight/2);
			// window Center
			var wc=top+(height/2);
			
			var scrollDistance=(ec-wc);
			
			// log.info( "scrool distance:"+scrollDistance);
			
			return scrollDistance;
		} else {
			return 0;
		}						 
	} else {
		return 0;
	}
};

SINGLETON.getVerticalDistanceToParent=function(el,parent){	
	if (el){
		var e=$(el);

		var stop = $(window).scrollTop();

		
		var win=$(parent);
		var top = win.scrollTop();
		var height=win.height();
		var offset = e.offset();
		var etop=offset.top-stop;
		var eHight=e[0].offsetHeight;

		var bottom = top + height;

		  log.info( "etop:"+etop+
					" top:"+top+
					" stop:"+stop+
					" height:"+height+
					" bottom:"+bottom+
					"");
		if ( etop < 0){
			log.info("Up to the upper limit");
		}
		if ( etop > height){
			log.info("down to the donw limit.");
		}
		
		if ( etop < 0 ||						 
			 etop > height ){
			
			// element center
			var ec=etop+(eHight/2);
			// window Center
//			var wc=top+(height/2);
			var wc=(height/2);
			
			var scrollDistance=(ec-wc);
			
			// log.info( "scrool distance:"+scrollDistance);
			
			return scrollDistance;
		} else {
			return 0;
		}						 
	} else {
		return 0;
	}
};


SINGLETON.toParent=function(el,parent,time){
	if (el.length===0){
		return;
	}
	var distance=SINGLETON.getVerticalDistanceToParent(el,parent);
	var top = $(parent).scrollTop();

	if (distance === 0) {
		return ;
	} else {
		log.info( "distance:"+distance+
				  " top:"+top);
		
//		$('html, body').animate({
		$(parent).animate({
			scrollTop: top+distance
		}, (time)?time:DEFAULT_SCROLL_SPEED);
	}		

};

SINGLETON.to=function(el,time){
	if (el.length===0){
		return;
	}
	var distance=SINGLETON.getVerticalDistance(el);
	var top = $(window).scrollTop();

	if (distance === 0) {
		return ;
	} else {
		$('html, body').animate({
//		$(window).animate({
			scrollTop: top+distance
		}, (time)?time:DEFAULT_SCROLL_SPEED);
	}		
};

SINGLETON.scrollToElement=SINGLETON.to;


module.exports=SINGLETON;
