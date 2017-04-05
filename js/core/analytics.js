// requires prototypes.js base.js
/*global ept */
/*global ga */

/*eslint-disable semi */
  (function(i,s,o,g,r,a,m){	'use strict';	i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
/*eslint-disable semi*/

(function( $, ept, ga ) {

	'use strict';
/**
 * Analytics
 * @namespace ept.analytics
 */
	ept.analytics = {};
/**
* Retrieve correct Tracking code
* @function getTracker
* @memberof ept.analytics
*/
	ept.analytics.getTracker = function() {
		var host = window.location.hostname, tracker='';
		if (host.indexOf('mymacys.net')>-1) { tracker = 'UA-80987364-1'; }
		if (host.indexOf('mybloomingdales.net')>-1) { tracker = 'UA-81005425-1'; }
		if (host.indexOf('macyspartners')>-1) { tracker = ''; }
		if (host.indexOf('//test')>-1) { tracker = 'UA-69984440-1'; }
		if (host.indexOf('int.')>-1) { tracker = 'UA-69984440-1'; }
		if (host.indexOf('preprod.')>-1) { tracker = 'UA-69984440-1'; }
    return tracker || 'UA-69984440-1';
	};

  ept.analytics.setName = function() {
		var host = window.location.hostname, name='';
		if (host.indexOf('mymacys.net')>-1) { name = 'MyMacys'; }
		if (host.indexOf('mybloomingdales.net')>-1) { name = 'MyBloomingdales'; }
		if (host.indexOf('int.')>-1) {name = 'Int';}
		if (host.indexOf('preprod.')>-1) { name = 'PreProd'; }
    return name;
  };

/**
* Send analytics data
* @function send
* @memberof ept.analytics
* @function send
* @param {string} cat  Category for the Event
* @param {string} action  Action for the Event
* @param {string} label  Label for the Event
* @param {string} [val]  Value for the Event
*/
	ept.analytics.send = function ( cat, action, label, val ) {
		if ( typeof ga !== 'function' ) { return false; }
		if ( typeof cat === 'object' ) { ga( 'send', cat ); return true; }
		window.sendGAEvent(cat, action, label, val ||0 );
	};

/**
* Reads a given DOM element to get tracking information
* @function read
* @memberof ept.analytics
*/
	ept.analytics.read = function( domElement ) {
		if ( typeof ga === 'function' ) {
			var $t = $(domElement) ;
			var cat =  $t.attr('data-ga-category') || false;
			var action =  $t.attr('data-ga-action') || false;
			var label =  $t.attr('data-ga-label') || false;
			var val = $t.attr('data-ga-value')-0 || 0;
			var tmp;
			/********HACK HACK HACK HACK HACK FOR MP NAVIGATION ELEMENTS*/
			if (cat ==='Navigation') {tmp=action;action=label;label=tmp;}
			/********HACK HACK HACK HACK HACK */
			if ( !cat || !action || !label ) {	ept.log('GA - No values!'); return false;	}
			window.sendGAEvent(cat, action, label, val );
		}
	};

	ept.analytics.getUser = function() {
		var x = $("meta[Name='Employeeid']").attr('Content')+'';
		return x;
	};

	ept.analytics.getBU = function () {
		return $( 'meta[name=NavFOB]' ).attr( 'content' ) + '' || '';
	};

/**
* Initialize Analytics tracking
* @function init
* @memberof ept.analytics
*/
	ept.analytics.init = function() {
        if (window.location.hostname.indexOf('macyspartners')===-1) {
        //track external links
            $('a[href^="http"]').each(function(i,el){
                var $a =$(el), current = window.location.hostname, link = $a.attr('href'), txt = $a.text();
                if (link.indexOf(current)===-1) {
                    $a.attr({'data-ga-category':'ExternalLink','data-ga-action':link, 'data-ga-label':(txt) ? txt : 'No text' });
                }
            });


            $('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"], a[href$=".xls"], a[href$=".xlsx"], a[href$=".ppt"], a[href$=".pptx"]').each(function(i,el){
                var $a =$(el), link = $a.attr('href'), txt = $a.text();
                $a.attr({'data-ga-category':'Document','data-ga-action':link, 'data-ga-label': (txt) ? txt : 'No text' });
            });

            $( document ).on( 'click.ga', '[data-ga-category]', function(e) {
                e.preventDefault();
                var $el = $(e.target);
                ept.analytics.read( e.target );
                $el.off('click.ga').trigger('click');
            });
        }
	};

	ept.onload('ept.analytics.init');
	ga( 'create',{
		trackingId: ept.analytics.getTracker(),
		cookieDomain: 'auto',
		userId: ept.analytics.getUser()
	});
	ga('set', {
		dimension1 : ept.analytics.getUser(),
		dimension2 : ept.analytics.getBU()
	});
	ga( 'send', 'pageview');

})( jQuery, ept, ga );

(function(){
	'use strict';
	window.sendGAEvent = function (cat,action,label,val){ga( 'send', 'event' , cat, action, label,val );};
})();
