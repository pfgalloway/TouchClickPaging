// global constants

	var umbrellaDivId	= "TCPpages"

// global variables

	var	TCPpages		= new Array() ;
	var TCPcurrentPage	= 1 ;
	var TCPpageWidth	= 0 ;


function TCPinitialisation() {

	console.log("initialisation") ;
	
	TCPfindPages() ;
	
	TCPinitialisePageIndicators() ;
	
	TCPinitialisePages() ;

	TCPinstallCustomCSS() ;	
}



//
// Initialisation routines
//

function TCPfindPages() {

	var umbrellaDiv		= document.getElementById(umbrellaDivId) ;
	
	// store width of this space, needed to hiding pages
	TCPpageWidth	= parseInt(document.defaultView.getComputedStyle(umbrellaDiv, null).getPropertyValue("width")) ;
	
	var allChildNodes	= umbrellaDiv.childNodes ;
	
	for (var i=0; i < allChildNodes.length; i++) {

		var currentChild	= allChildNodes[i] ;

		if (typeof(currentChild) != "undefined") {
			var someAttributes	= currentChild.attributes ;
			if (someAttributes != null) {
				
				if (currentChild.hasAttribute("data-TCPpageNum") ) {
					var pageNumber			= parseInt(currentChild.getAttribute("data-TCPpageNum")) ;
					
					console.log ("found page: " + pageNumber ) ;
					TCPpages[pageNumber]	= currentChild ;
				}
			}
		}
	}
}



function TCPinitialisePageIndicators() {

	var TCPindicator	= document.getElementById("TCPindicators") ;
	var indicatorHTML	= "" ;
	
	// check if a start page is indicated
	if (TCPindicator.hasAttribute("data-TCPstart") )
		TCPcurrentPage	= parseInt(TCPindicator.getAttribute("data-TCPstart")) ;
	
	// insert indicators
	for (var i=1; i < TCPpages.length; i++) {
	
		indicatorHTML	+= '<span data-pageNum="' + i + '" class="TCPindicator" ' ;
		indicatorHTML	+= 'onclick="TCPpageIndicatorSelected(this);">&#9679;</span>' ;	
	}
	
	TCPindicator.innerHTML	= indicatorHTML ;
}



function TCPinitialisePages() {

	for (var i=1; i < TCPpages.length; i++) {
	
		console.log ("looking at page " + i + " of total " + (TCPpages.length - 1) ) ;
		
		// add basic style
		var currentPage	= TCPpages[i] ;
		
		TCP_addToClass(currentPage, "TCPpage") ;
		
		if (i < TCPcurrentPage) 
			TCP_addToClass(currentPage, "TCPoffscreenLeft") ;
		
		else if (i == TCPcurrentPage)
				TCP_addToClass(currentPage, "TCPonscreen") ;
			else
				TCP_addToClass(currentPage, "TCPoffscreenRight") ;
	}
}


function TCPinstallCustomCSS() {

	var EOL			= '\n' ;
	
	var TCPstyle	= '' ;
	
	TCPstyle	+= '<!-- Dynamic CSS for TouchControlPaging -->' 	+ EOL ;
	TCPstyle	+= '<style type="text/css">' 						+ EOL ;
	TCPstyle	+= '	div#TCPpages {' 							+ EOL ;
	TCPstyle	+= '		overflow: hidden; '			 			+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;
	TCPstyle	+= ''												+ EOL ;

	TCPstyle	+= '	div.TCPpage {'	 							+ EOL ;
	TCPstyle	+= '		position: 	absolute;'					+ EOL ;
	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '		top:		0px;'						+ EOL ;
	TCPstyle	+= '		bottom: 	0px;'						+ EOL ;
	TCPstyle	+= '		height: 	auto;'						+ EOL ;
	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '		right: 		auto;'						+ EOL ;
	TCPstyle	+= '		width: 	' + TCPpageWidth + 'px;'		+ EOL ;
	TCPstyle	+= ''												+ EOL ;
							// transition animation
	TCPstyle	+= '		-webkit-transition-property: 	left ;'	+ EOL ;
	TCPstyle	+= '		-webkit-transition-duration: 	0.5s ;'	+ EOL ;
	TCPstyle	+= '		-moz-transition-property: 		left ;'	+ EOL ;
	TCPstyle	+= '		-moz-transition-duration: 		0.5s ;'	+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;

	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '	div.TCPonscreen {'							+ EOL ;
	TCPstyle	+= '		left:		0px ;'						+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;
	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '	div.TCPoffscreenLeft {'						+ EOL ;
	TCPstyle	+= '		left:	-' +TCPpageWidth + 'px;'		+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;
	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '	div.TCPoffscreenRight {'					+ EOL ;
	TCPstyle	+= '		left:	' +TCPpageWidth + 'px;'			+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;
	TCPstyle	+= ''												+ EOL ;

	TCPstyle	+= '	span.TCPindicator {'						+ EOL ;
	TCPstyle	+= '		padding: 	5px;'						+ EOL ;
	TCPstyle	+= '		cursor: 	pointer;'					+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;
	TCPstyle	+= '</style>' 										+ EOL ;
	
	
	// insert dynamic CSS into page header
	var headHTML = document.getElementsByTagName('head')[0].innerHTML;
	headHTML    += TCPstyle ;
	document.getElementsByTagName('head')[0].innerHTML = headHTML;
}



//
// operational routines
//

function TCPpageIndicatorSelected(pageIndicator) {

	if (pageIndicator.hasAttribute("data-pageNum") ) {
		newPage	= pageIndicator.getAttribute("data-pageNum") ;

		console.log("page indicator selected " + newPage) ;

		if (newPage != TCPcurrentPage) {
		
			TCPcurrentPage	= newPage ;
			
			TCPupdateDisplay() ;
		}
	}
}


function TCPupdateDisplay() {

	for (var i=1; i < TCPpages.length; i++) {
	
		// add basic style
		var currentPage	= TCPpages[i] ;
		console.log("------------------------------------") ;
	
		if (i < TCPcurrentPage) {
			console.log("making sure page " + i + " is left") ;
			TCP_removeFromClass(currentPage, "TCPoffscreenRight") ;
			TCP_removeFromClass(currentPage, "TCPonscreen") ;
			TCP_addToClass(currentPage, "TCPoffscreenLeft") ;
		
		} else {
			if (i == TCPcurrentPage) {
				console.log("making sure page " + i + " is onscreen") ;
				TCP_removeFromClass(currentPage, "TCPoffscreenRight") ;
				TCP_removeFromClass(currentPage, "TCPoffscreenLeft") ;
				TCP_addToClass(currentPage, "TCPonscreen") ;

			} else {
				console.log("making sure page " + i + " is right") ;
				TCP_removeFromClass(currentPage, "TCPoffscreenLeft") ;
				TCP_removeFromClass(currentPage, "TCPonscreen") ;
				TCP_addToClass(currentPage, "TCPoffscreenRight") ;
			}
		}
	}
}




//
// support functions
//

function TCP_addToClass (anElement, classValue) {

	var currentClass	= "" ;
	var newClass		= "" ;
	
	if (anElement.hasAttribute("class") ) 
		currentClass	= anElement.getAttribute("class") ;
		
    if (currentClass.search(classValue) < 0)  // new value not already present
    	newClass		= currentClass.concat(" " + classValue + " ") ;
    else
    	newClass		= currentClass ;

    // strip out double+ spaces that may have snuck in
    newClass		= newClass.replace (/\s{2,}/, " ") ;

	if (window.XMLHttpRequest) 	// code for IE7+, Firefox, Chrome, Opera, Safari
	    anElement.setAttribute("class", newClass) ;
			
	else 						// code for IE6, IE5
	    anElement.setAttribute('className', newClass) ;
}



function TCP_removeFromClass (anElement, classValue) {


    var currentClass	= anElement.getAttribute("class") ;

    var newClass		= currentClass.replace(classValue, " ") ;
    
    newClass			= newClass.replace (/\s{2,}/, " ") ;

	if (window.XMLHttpRequest) 	// code for IE7+, Firefox, Chrome, Opera, Safari			better test?
	    anElement.setAttribute("class", newClass) ;
			
	else 						// code for IE6, IE5
	    anElement.setAttribute('className', newClass) ;
}
