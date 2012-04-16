#Touch/Click Paging#

A paging applet for HTML/Javascript using CSS3 attributes for on-screen animations.

This is from a project a wrote that didn't get released but I was happy with how this part turned out.


##Configuring###
Probably easiest to view the sample HTML file but

1. You identify the containing DIV with id="TCPpages"

2. All pages within the containing DIV that you want TCP to control *must* have an attribute "data-TCPpageNum=x" where 'x' is the page number.  I don't currently check for duplicate page numbers.

3. Within the page div, you can also have an *optional* attribute "data-TCPtitle=pageTitle" and that page title will be picked up and used as hover text for the page indicators

4. Somewhere on your page you *must* have a DIV with ID "TCPindicators".  The page indicator 'dots' will be place here.

5. the TCPindicators DIV can have an *optional* attribute "data-TCPstart=x" where 'x' is the first page to display.

6. you *must* call TCPinitialisation() at some point, eg body onload


##Functions###
Note: You don't need to call these functions for Touch/Click Paging to work, they are there should you wish to augment.

###TCPcanScrollRight()###
returns FALSE if there are no more pages that can scroll in from the right.  Else TRUE

###TCPcanScrollleft()###
returns FALSE if there are no more pages that can scroll in from the left.  Else TRUE

###TCPcurrentPage()###
returns current page number.  Note pages start at page 1.  (Just as there is no spoon, there is no page 0)

###TCPnumberOfPages()###
returns total number of pages in the scroll.

##Author##
Peter Galloway, from [Nomadech](http://nomadech.com).  And on twitter [here](http://twitter.com/#!/pfgalloway)

