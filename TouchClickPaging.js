// global constants

	var umbrellaDivId	= "TCPpages"

// global variables

	var	TCPpages		= new Array() ;
	var TCPcurrentPage	= 1 ;
	var TCPpageWidth	= 0 ;


function TCPinitialisation() {

	console.log("initialisation") ;
	
	findTCPpages() ;
	
	initialiseTCPpageIndicators() ;
	
	initialiseTCPpages() ;

	installCustomCSS() ;	
}


function findTCPpages() {

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



function initialiseTCPpageIndicators() {

	var TCPindicator	= document.getElementById("TCPindicators") ;
	var indicatorHTML	= "" ;
	
	// check if a start page is indicated
	if (TCPindicator.hasAttribute("data-TCPstart") )
		TCPcurrentPage	= parseInt(TCPindicator.getAttribute("data-TCPstart")) ;
	
	// insert indicators
	for (var i=1; i < TCPpages.length; i++) {
	
		indicatorHTML	+= '<span class="TCPindicator">&#9679;</span>' ;	
	}
	
	TCPindicator.innerHTML	= indicatorHTML ;
}



function initialiseTCPpages() {

	for (var i=1; i < TCPpages.length; i++) {
	
		console.log ("looking at page " + i + " of total " + (TCPpages.length - 1) ) ;
		
		// add basic style
		var currentPage	= TCPpages[i] ;
		
		_addToClass(currentPage, "TCPpage") ;
		
		if (i < TCPcurrentPage) 
			_addToClass(currentPage, "TCPoffscreenLeft") ;
		
		else if (i == TCPcurrentPage)
				_addToClass(currentPage, "TCPonscreen") ;
			else
				_addToClass(currentPage, "TCPoffscreenRight") ;
	}
}


function installCustomCSS() {

	var TCPstyle	= '' ;
	
	var EOL		= '\n' ;
	
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
	TCPstyle	+= '	}' 											+ EOL ;
	TCPstyle	+= '</style>' 										+ EOL ;
	
	
	// insert dynamic CSS into page header
	var headHTML = document.getElementsByTagName('head')[0].innerHTML;
	headHTML    += TCPstyle ;
	document.getElementsByTagName('head')[0].innerHTML = headHTML;
}



function _addToClass (anElement, classValue) {

	console.log ("looking at element which is " + typeof(anElement) ) ;
	

	var currentClass	= "" ;
	
	if (anElement.hasAttribute("class") ) 
		currentClass	= anElement.getAttribute("class") ;
					
    if (currentClass.search(classValue) < 0)  // new value not already present
    	newClass		= currentClass.concat(" " + classValue + " ") ;

    // strip out double+ spaces
    newClass		= newClass.replace (/\s{2,}/, " ") ;
    
	if (window.XMLHttpRequest) 	// code for IE7+, Firefox, Chrome, Opera, Safari
	    anElement.setAttribute("class", newClass) ;
			
	else 						// code for IE6, IE5
	    anElement.setAttribute('className', newClass) ;
}

function _removeFromClass (anElement, classValue) {
    var currentClass	= anElement.getAttributeNode("class").value ;

    var newClass		= currentClass.replace(classValue, " ") ;
    newClass		= newClass.replace (/\s{2,}/, " ") ;
    
	if (window.XMLHttpRequest) 	// code for IE7+, Firefox, Chrome, Opera, Safari			better test?
	    anElement.setAttribute("class", newClass) ;
			
	else 						// code for IE6, IE5
	    anElement.setAttribute('className', newClass) ;
}
