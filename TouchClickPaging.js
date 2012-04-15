// global constants

	var constMothershipDivID	= "TCPpages" ;
	var constPageNumAttribute	= "data-TCPpageNum" ;
	var constPageTitleAttribute	= "data-TCPtitle" ;
	

	
// global variables

	var	TCPpages		= new Array() ;
	var TCPindicators	= new Array() ;
	var TCPpageTitles	= new Array() ;
	
	var TCPcurrentPage	= 1 ;
	var TCPpageWidth	= 0 ;

 	var TCPtouchStartX	= 0 ;
    var TCPtouchLastX	= 0 ;
    
    var	TCPpageLeft		= undefined ;
	var TCPpageRight	= undefined ;
	
	var TCPpageStartLeft	= 0 ;
	
	var TCPcurrentlySlidingPage	= false ;


function TCPinitialisation() {

	TCPfindPages() ;
	
	TCPinitialisePageIndicators() ;
	
	TCPinitialisePages() ;

	TCPinstallCustomCSS() ;	
	
	TCPupdateDisplay() ;
}



//
// Initialisation routines
//

function TCPfindPages() {

	var mothershipDiv	= document.getElementById(constMothershipDivID) ;
	
	// store width of this space, needed to hiding pages
	TCPpageWidth		= parseInt(document.defaultView.getComputedStyle(mothershipDiv, null).getPropertyValue("width")) ;
	
	var allChildNodes	= mothershipDiv.childNodes ;
	
	for (var i=0; i < allChildNodes.length; i++) {

		var currentChild	= allChildNodes[i] ;

		if (typeof(currentChild) != "undefined") {
			var someAttributes	= currentChild.attributes ;
			if (someAttributes != null) {
				
				if (currentChild.hasAttribute(constPageNumAttribute) ) {
					var pageNumber				= parseInt(currentChild.getAttribute(constPageNumAttribute)) ;
					
					TCPpages[pageNumber]		= currentChild ;
					
					
					TCPpageTitles[pageNumber]	= "" ;
					
					if (currentChild.hasAttribute(constPageTitleAttribute) ) {
						var pageTitle		= currentChild.getAttribute(constPageTitleAttribute) ;
						
						TCPpageTitles[pageNumber]	= pageTitle ;	
					}
				}
			}
		}
	}
}



function TCPinitialisePageIndicators() {

	var TCPindicator	= document.getElementById("TCPindicators") ;
	
	// check if a start page is indicated
	if (TCPindicator.hasAttribute("data-TCPstart") )
		TCPcurrentPage	= parseInt(TCPindicator.getAttribute("data-TCPstart")) ;
	
	// insert indicators
	for (var i=1; i < TCPpages.length; i++) {
	
		var indicatorHTML	= "" ;
		var indicatorID		= "TCPindicatorID"+i ;
	
		indicatorHTML	+= '<span id="' + indicatorID + '" ';
		indicatorHTML	+= constPageNumAttribute + '="' + i + '" class="TCPindicator" ' ;
		indicatorHTML	+= 'onclick="TCPpageIndicatorSelected(this);">' ;
		
		indicatorHTML	+=	'&#9679;' ;

		if (TCPpageTitles[i] != "")
			indicatorHTML	+= '<span>' + TCPpageTitles[i] + '</span>' ;
		
		indicatorHTML	+=	'</span>' ;
		
		TCPindicator.innerHTML	+= indicatorHTML ;

	}
	
	for (var i=1; i < TCPpages.length; i++) {
		// for some reason I couldn't grab the element while in the above loop

		var indicatorID		= "TCPindicatorID"+i ;

		TCPindicators[i]	= document.getElementById(indicatorID) ;
	}
}



function TCPinitialisePages() {

	for (var i=1; i < TCPpages.length; i++) {
	
		// add basic style
		var currentPage	= TCPpages[i] ;
		
		TCP_addToClass(currentPage, "TCPpage") ;
		
		if (i < TCPcurrentPage) 
			TCP_addToClass(currentPage, "TCPoffscreenLeft") ;
		
		else if (i == TCPcurrentPage)
				TCP_addToClass(currentPage, "TCPonscreen") ;
			else
				TCP_addToClass(currentPage, "TCPoffscreenRight") ;

		TCP_addAttribute(currentPage, "onmousedown",	"TCPpagemouseBegan(event, this)") ;
		TCP_addAttribute(currentPage, "onmousemove", 	"TCPpagemouseMove(event, this)") ;
		TCP_addAttribute(currentPage, "onmouseup", 		"TCPpagemouseEnd(event, this)") ;
		TCP_addAttribute(currentPage, "onmouseout", 		"TCPpagemouseEnd(event, this)") ;
				
		TCP_addAttribute(currentPage, "ontouchstart",	"TCPpagetouchBegan(event, this)") ;
		TCP_addAttribute(currentPage, "ontouchmove", 	"TCPpagetouchMove(event, this)") ;
		TCP_addAttribute(currentPage, "ontouchend", 	"TCPpagetouchEnd(event, this)") ;
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
	TCPstyle	+= '		padding: 	0.5em;'						+ EOL ;
	TCPstyle	+= '		cursor: 	pointer;'					+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;

	TCPstyle	+= '	span.TCPindicator.TCPcurrentPage {'			+ EOL ;
	TCPstyle	+= '		color: 		white;'						+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;

	TCPstyle	+= '	span.TCPindicator span {'					+ EOL ;
	TCPstyle	+= '		position: 	absolute;'					+ EOL ;
	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '		font-size:	0.5em ;'					+ EOL ;
	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '		top: 		-.5em;'						+ EOL ;
	TCPstyle	+= '		margin-left:-1.5em;'					+ EOL ;
	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '		opacity:	0 ;'						+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;

	TCPstyle	+= '	span.TCPindicator:hover span {'				+ EOL ;
	TCPstyle	+= ''												+ EOL ;
	TCPstyle	+= '		opacity:	0.5 ;'						+ EOL ;
	TCPstyle	+= '	}' 											+ EOL ;

	TCPstyle	+= '</style>' 										+ EOL ;
	
	// insert dynamic CSS into page header
	var headHTML = document.getElementsByTagName('head')[0].innerHTML;
	headHTML    += TCPstyle ;
	document.getElementsByTagName('head')[0].innerHTML = headHTML;
}


//
// !operational routines
//

function TCPpageIndicatorSelected(pageIndicator) {

	if (pageIndicator.hasAttribute(constPageNumAttribute) ) {
		
		newPage	= pageIndicator.getAttribute("data-TCPpageNum") ;

		if (newPage != TCPcurrentPage) {
		
			TCPcurrentPage	= newPage ;
			
			TCPupdateDisplay() ;
		}
	} 
}


function TCPupdateDisplay() {

	for (var i=1; i < TCPpages.length; i++) {
	
		// add basic style
		var currentPage			= TCPpages[i] ;
		var currentIndicator	= TCPindicators[i] ;

		if (i < TCPcurrentPage) {
			TCP_removeFromClass(currentPage, "TCPoffscreenRight") ;
			TCP_removeFromClass(currentPage, "TCPonscreen") ;
			TCP_addToClass(currentPage, "TCPoffscreenLeft") ;
			
			TCP_removeFromClass(currentIndicator, "TCPcurrentPage") ;
		
		} else {
			if (i == TCPcurrentPage) {
				TCP_removeFromClass(currentPage, "TCPoffscreenRight") ;
				TCP_removeFromClass(currentPage, "TCPoffscreenLeft") ;
				TCP_addToClass(currentPage, "TCPonscreen") ;
				
				TCP_addToClass(currentIndicator, "TCPcurrentPage") ;

			} else {
				TCP_removeFromClass(currentPage, "TCPoffscreenLeft") ;
				TCP_removeFromClass(currentPage, "TCPonscreen") ;
				TCP_addToClass(currentPage, "TCPoffscreenRight") ;

				TCP_removeFromClass(currentIndicator, "TCPcurrentPage") ;
			}
		}
	}
}


// !action begins

function TCPpagemouseBegan(event, mousedPage) {

    TCPtouchStartX				= event.clientX ;
    TCPtouchLastX				= TCPtouchStartX ;

	TCPpageActBegan (event, mousedPage) ;
}

function TCPpagetouchBegan(event, touchedPage) {

    TCPtouchStartX				= event.touches[0].clientX ;
    TCPtouchLastX				= TCPtouchStartX ;

	TCPpageActBegan (event, touchedPage) ;
}


function TCPpageActBegan(event, activePage) {

	TCPcurrentlySlidingPage	= true ;

    TCPpageStartLeft			= parseInt("0"+activePage.style.left) ;

    // find page on left and page on right
    var pageNumber			= parseInt(activePage.getAttribute(constPageNumAttribute)) ;
    
    var pageLeftNumber		= pageNumber-1 ;
    var pageRightNumber		= pageNumber+1 ;
    
    TCPpageLeft		= undefined ;
    TCPpageRight	= undefined ;
    
    if (pageLeftNumber > 0 ) {
    	TCPpageLeft	= TCPpages[pageLeftNumber] ;
    	TCPremoveCSStransition(TCPpageLeft) ;
    }
    
    if (pageRightNumber < (TCPpages.length ) ) {
    	TCPpageRight	= TCPpages[pageRightNumber] ;
    	TCPremoveCSStransition(TCPpageRight) ;
    }
    
    TCPremoveCSStransition(activePage) ;			// so page responds immediately to our touch
}



// !action in progress

function TCPpagemouseMove(event, mousedPage) {


	if (TCPcurrentlySlidingPage) {
	    var currentTouch		= event.clientX ;

	    bigDelta				= currentTouch - TCPtouchStartX ;
	    littleDelta				= currentTouch - TCPtouchLastX ;

		TCPpageActMove (event, mousedPage) ;

		TCPtouchLastX				= currentTouch ;
	}
}

function TCPpagetouchMove(event, touchedPage) {

    var currentTouch		= event.touches[0].clientX ;

    bigDelta				= currentTouch - TCPtouchStartX ;
    littleDelta				= currentTouch - TCPtouchLastX ;

	TCPpageActMove (event, touchedPage) ;
	
	TCPtouchLastX				= currentTouch ;
}

function TCPpageActMove (event, activePage) {

    // let's move this page a smidge
    var newLeft				= TCPpageStartLeft + bigDelta ;
    activePage.style.left	= newLeft+'px' ;
    

    if (TCPpageLeft != undefined) {
    	var thisLeft = newLeft - TCPpageWidth ;
    	TCPpageLeft.style.left	= thisLeft + 'px' ;
    }
    
    if (TCPpageRight != undefined) {
    	var thisLeft			= newLeft+TCPpageWidth ;
    	TCPpageRight.style.left	= thisLeft+ 'px' ;
    }
    
}


// !action ends
function TCPpagemouseEnd(event, mousedPage) {

	TCPpageActEnd (event, mousedPage) ;
}


function TCPpagetouchEnd(event, touchedPage) {

	TCPpageActEnd (event, touchedPage) ;
}


function TCPpageActEnd (event, activePage) {

	TCPcurrentlySlidingPage	= false ;
	
    var slideDirection 	= "revert" ;
    
    var endLeft			= 0 ;

    var pageNumber		= parseInt(activePage.getAttribute(constPageNumAttribute)) ;
    var newPageNumber	= pageNumber ;
    
    var currentTouch	= TCPtouchLastX ;

    var bigDelta		= currentTouch - TCPtouchStartX ;

    endLeft				= TCPpageStartLeft + bigDelta ;
    
    if (endLeft > TCPpageStartLeft+(TCPpageWidth / 2)) {
    	slideDirection	= "right" ;
    	
    	if (pageNumber > 1) {
    		TCPcurrentPage = pageNumber -1 ;
    	} else {
    		slideDirection	= "revert" ;
    	}
    }
    
    if (endLeft < TCPpageStartLeft-(TCPpageWidth / 2)) {
    	slideDirection	= "left" ;
    	
    	if (pageNumber < TCPpages.length - 1)
    		TCPcurrentPage	= pageNumber + 1 ;
    	else
    		slideDirection	= "revert" ;
    }

    // remove our styles from all pages so predefined CSS will again dominate
    for (i=1; i < TCPpages.length; i++) 
    	TCPpages[i].style.cssText="" ;

    if (slideDirection != "revert") 
    	TCPupdateDisplay() ;
}


function TCPremoveCSStransition(fromPage) {

    var newCSS	= "-webkit-transition-duration:0;" ;
    fromPage.style.cssText=	newCSS ;
	
}



//
// !user functions
//

function TCPcanScrollRight() {

	if (TCPcurrentPage < (TCPpages.length - 1) )
		return true ;
	else
		return false ;
}


function TCPcanScrollleft() {

	if (TCPcurrentPage > 1  )
		return true ;
	else
		return false ;
}

function TCPcurrentPage() {

	return TCPcurrentPage ;
}


function TCPnumberOfPages() {

	return TCPpages.length - 1 ;
}

//
// !support functions
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


function TCP_addAttribute (anElement, attribute, attributeValue) {

	anElement.setAttribute(attribute, attributeValue) ;
}



	function noMove (event) {
	
		event.preventDefault() ;
	}
