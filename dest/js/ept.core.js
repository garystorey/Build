(function(){

  'use strict';

  if (typeof String.prototype.startsWith !== 'function' ) {
   String.prototype.startsWith = function(str){
     return (this.match('^'+str)===str);
   };
  }

  if (typeof String.prototype.endsWith !== 'function' ) {
   String.prototype.endsWith = function(str) {
     return (this.match(str+'$')===str);
   };
  }

  if ( typeof String.prototype.toProperCase !== 'function' ) {
    String.prototype.toProperCase = function () {
      return this.toLowerCase().replace(/^(.)|\s(.)/g, function (t) { return t.toUpperCase(); });
    };
  }

  if (typeof String.prototype.pad !== 'function' ) {
    String.prototype.pad = function (i, e){
      var s = this;
      while( s.length < i ) { s = e ? e : '0' + s; }
      return s;
    };
  }

  if ( typeof String.prototype.includes !== 'function' ) {
    String.prototype.includes = function (t) {
      return this.indexOf(t) > -1;
    };
  }

  if ( typeof String.prototype.has !== 'function' ) {
    String.prototype.has = function (t) {
      return this.indexOf(t) > -1;
    };
  }

  if ( typeof String.prototype.replaceAll !== 'function' ) {
    String.prototype.replaceAll = function (t, e) {
      return this.split(t).join(e);
    };
  }

})();

// requires prototypes.js
/*global macysEditMode */

(function () {

    'use strict';
    /**
     * Enterprise Portal Team
     * @namespace ept
     * @author Gary Storey ( gary.storey@macys.com )
     */
    var ept = {
        /**
         * Turns on logging on or off
         * @see ept.log
         * @property {boolean} debug Turns logging on/off
         * @memberof ept
         */
        debug: false,
        /**
         * URL of main support page
         * @property {string} supportURL URL of main support page
         * @memberof ept
         */
        supportURL: 'http://mymacys.net/sites/EPT/workrequest/Pages/CustomerRequest.aspx',
        onLoadFunctions: [] //array to hold onload events
    };

    /**
     * Checks to see if you are currently in Sharepoint Edit mode on a page
     * @function isEditMode
     * @memberof ept
     * @returns {Boolean}
     */
    ept.isEditMode = function () {
        return !(typeof macysEditMode === 'undefined' || $('#MSOLayout_InDesignMode').val() === '');
    };

    /**
     * Logs {txt} message to the console after verifying console exists and ept.debug is true
     * @function log
     * @memberof ept
     * @param {string} txt Information to log to console
     */
    ept.log = function (txt) {
        /* eslint-disable no-console */
        if (window.console && console.log && ept.debug) {
            console.log(txt);
        }
        /* eslint-enable no-console */
    };

    /**
     * Is the current browser touch capable;
     * @function isTouch
     * @memberof ept
     * @returns {Boolean}
     */
    ept.isTouch = function () {
        return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
    };

    /**
     * Removes all HTML tags from the current string
     * @function removeHTML
     * @memberof ept
     * @param {string} htmlString  String to parse
     * @returns {string}
     */
    ept.removeHTML = function (htmlString) {
        if (htmlString) {
            var mydiv = document.createElement('div');
            mydiv.innerHTML = htmlString;
            return (document.all) ? mydiv.innerText : mydiv.textContent;
        }
        return '';
    };


    /**
     * Loops through NodeLists like an array
     * @function forEach
     * @memberof ept
     * @param {array} array  arraylike object including NodeLists
     * @param {function} callback  callback function to execute for each item
     * @param {string} [scope]  Optional. Provide a scope, default to global. Usually not needed.
     */
    ept.forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };

    /**
     * Creates an HTML element based on JSON object
     * @function createElement
     * @memberof ept
     * @param {object} JSON Object {tag:'div' ,id:'', classes=['class1',class2], text:'Hello World', parentEl : element }
     * @returns {element};
     */

    ept.createElement = function (data) {
        var el, txt, len;
        if (typeof data === 'string') {
            el = document.createElement('div');
            el.innerHTML = data;
            return el.firstChild;
        }
        el = document.createElement(data.tag);
        txt = document.createTextNode(data.text);
        el.appendChild(txt);
        if (data.id) {
            el.setAttribute('id', data.id);
        }
        if (data.classes) {
            len = data.classes.length;
            while (len--) {
                el.classList.add(data.classes[len]);
            }
        }
        return el;
    };

    /**
     * Removes all special characters from a string
     * @function removeSpecialChars
     * @memberof ept
     * @param {string} str  string to remove special characters from
     */
    ept.removeSpecialChars = function (str) {
        return str.replace(/[^\w\s]/gi, '');
    };

    /**
     * Removes all spaces from a string
     * @function removeSpaces
     * @memberof ept
     * @param {string} str  string to remove spaces from
     */
    ept.removeSpaces = function (str) {
        return str.replaceAll(' ', '');
    };

    /**
     * Add a function to be called after page load is completed
     * @function onLoad
     * @memberof ept
     * @param {string} cb  Name of function to call after page load
     */
    ept.onLoad = function (cb) {
        ept.onLoadFunctions.push(cb);
    };
    ept.onload = ept.onLoad;

    /**
     * Execute functions after page load
     * @function onLoad
     * @memberof ept
     * @private
     */
    ept.executeOnLoad = function () {
        var func = ept.onLoadFunctions,
            len = func.length,
            i = 0,
            curr;
        if (len > 0) {
            for (; i < len; i++) {
                curr = func[i];
                ept.private.executeFunctionByName(curr);
            }
        }
        var el = document.body;
        var event = document.createEvent('Event');
        event.initEvent('onLoadComplete', true, true);
        el.dispatchEvent(event);
    };

    /**
     * Private methods
     * @namespace ept.private
     */
    ept.private = {

        executeFunctionByName: function (functionName, context) {
            context = context || window;
            var namespaces = functionName.split('.');
            var func = namespaces.pop();
            for (var i = 0, len = namespaces.length; i < len; i++) {
                context = context[namespaces[i]];
            }
            return context[func].apply(this);
        },

        setClasses: function () {
            var ua = navigator.userAgent.toString().toLowerCase();
            var url = location.href;
            if (url.indexOf('_layout')>-1 || url.indexOf('_catalog')>-1 || url.indexOf('/Lists/')>-1 || url.indexOf('/Forms/')>-1 ) {
                document.body.classList.add('systempage');
            }
            document.body.classList.add('js');
            document.body.classList.remove('no-js');

            if (ua.indexOf('trident') > -1) {
                document.body.classList.add('ie');
            }
            if (ua.indexOf('ipad') > -1) {
                document.body.classList.add('ipad');
            }
            if (ua.indexOf('android') > -1) {
                document.body.classList.add('android');
            }
        }
    };

    window.ept = ept;
}());


/***************************************************************************
 ****************************************************************************
 **** After page load
 ****************************************************************************
 ****************************************************************************/

(function (ept) {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        ept.private.setClasses();
        ept.executeOnLoad();
    });
})(ept);

// requires prototypes.js base.js
/*global jQuery ept */
( function( $, window, document, ept ){

  'use strict';
  var url = ept.supportURL;

  var removeItems = [
    'ctl00_PlaceHolderMain_SiteAdministration_RptControls_TranslationStatusListLink','ctl00_PlaceHolderMain_Customization_RptControls_AreaChromeSettings',
    'ctl00_PlaceHolderMain_Customization_RptControls_DesignEditor','ctl00_PlaceHolderMain_Customization_RptControls_Theme','ctl00_PlaceHolderMain_Galleries_RptControls_Themes',
    'ctl00_PlaceHolderMain_Customization_RptControls_AreaTemplateSettings','ctl00_PlaceHolderMain_Customization_RptControls_DesignImport','ctl00_PlaceHolderMain_Customization_RptControls_DeviceChannelSettings',
    'ctl00_PlaceHolderMain_Galleries_RptControls_CmsMasterPageCatalog','ctl00_PlaceHolderMain_UsersAndPermissions_RptControls_SiteAppPrincipals', 'ctl00_PlaceHolderMain_Galleries_RptControls_Designs',
    'ctl00_PlaceHolderMain_SiteAdministration_RptControls_RegionalSettings','ctl00_PlaceHolderMain_SiteAdministration_RptControls_AreaCacheSettings','ctl00_PlaceHolderMain_SiteAdministration_RptControls_VariationsNominateSiteLink',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_MetadataPropertiesSite','ctl00_PlaceHolderMain_SearchAdministration_RptControls_SiteSearchSettings','ctl00_PlaceHolderMain_SearchAdministration_RptControls_SrchVis',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_SearchConfigurationImportSPWeb','ctl00_PlaceHolderMain_SearchAdministration_RptControls_SearchConfigurationExportSPWeb',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_SearchConfigurationImportSPSite','ctl00_PlaceHolderMain_SearchAdministration_RptControls_SearchConfigurationExportSPSite',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SiteNavigationSettings','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SEOSettings',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_AuditSettings','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_Portal',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_PolicyTemplate','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SiteCollectionAppPrincipals',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SiteCacheProfiles','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_ObjectCacheSettings',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_HubUrlLinks','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SiteCacheSettings',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_VariationSettings','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_VariationLabels',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_TranslatableColumnsPage','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_PublishedLinks',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_ManageSiteHelpRendering','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_HtmlFieldSecurity',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_HealthCheck','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_Upgrade',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_ManageResultTypes','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_MetadataPropertiesSiteColl',
    'ctl00_PlaceHolderMain_SiteAdministration_RptControls_CatalogSources','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SearchConfigurationImportSPSite',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SearchConfigurationExportSPSite'
  ];

  var linkItems = [
    'ctl00_PlaceHolderMain_Galleries_RptControls_ManageField', 'ctl00_PlaceHolderMain_Galleries_RptControls_ManageCType',
    'ctl00_PlaceHolderMain_SiteAdministration_RptControls_TermStoreManagement','ctl00_PlaceHolderMain_ReportServerSettingsLinks_RptControls_ReportServerSchedules',
    'ctl00_PlaceHolderMain_ReportServerSettingsLinks_RptControls_ReportServerSiteLevelSettings',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_ManageResultSourcesSite','ctl00_PlaceHolderMain_SearchAdministration_RptControls_ManageResultTypes',
    'ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_DeletedItems','ctl00_PlaceHolderMain_SearchAdministration_RptControls_ManageQueryRulesSite2',
    'ctl00_PlaceHolderMain_SearchAdministration_RptControls_NoCrawlSettingsPage','ctl00_PlaceHolderMain_SiteCollectionAdmin_RptControls_SharePointDesignerSettings'
  ];

  var linkItemsTitle = [
    'SiteColumns','SiteContentTypes','TermStoreManagement','ManageSharedSchedules','ReportingServicesSiteSettings','SearchResultSources',
    'SearchResultTypes','RecycleBin','QueryRules','SearchableColumns','SPDesignerSettings'
  ];


  var removeAF = function ( item ) {
    $('#'+item).parent('.ms-linksection-listItem').remove();
  };
  var addEPTLink = function ( item, txt ) { $( '#' + item).parent( '.ms-linksection-listItem' ).append( '*  <a style="font-size:10px;" href="'+ url + txt +'">( Work with EPT )</a>'); };


  ept.private.daf = function() {
    var currurl = ept.url.href+'';
    if ( currurl.has( '_layouts/15/settings.aspx' ) && !ept.isTrue( ept.url.qs.eptenable ) ) {
      removeItems.forEach(removeAF);
      for (var i=0, l = linkItems.length; i<l; i++) {
        addEPTLink( linkItems[i], linkItemsTitle[i] );
      }

      $('.ms-siteSettings-root .ms-linksection-textCell').css('width','350px');
    }

    if ( currurl.has('_layouts/15/prjsetng.aspx') && !ept.isTrue(ept.url.qs.eptenable) ) {
      $('#ctl00_PlaceHolderMain_logoSection_ctl03_tablerow3').css('visibility','hidden');
      $('#ctl00_PlaceHolderMain_logoSection_ctl03_tablerow1').css('visibility','hidden');
    }

  }; //End DAF

ept.onload('ept.private.daf');



})(jQuery, window, document, ept);

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

// requires prototypes.js base.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ){

'use strict';

/**
* Read a Sharepoint List
* @function getSPList
* @memberof ept
* @deprecated [See ept.listItem]
* @param {string} siteName URL to the current SP Site
* @param {string} listName Name of the SP List to read
* @param {string} [options] Additional REST arguments
* @returns {object} A jQuery Promise object
*/
  ept.getSPList = function ( siteName, listName, options ) {
    var url = siteName +  "/_api/lists/getbytitle('" + listName + "')/items";
    url = url.replaceAll( '//', '/' );
    url += ( options ) ? '?' + options : '';
    return this.ajax( { url : url } );
  };

/**
* Read the name of Sharepoint List & Site from a given url
* @function getSiteAndListFromURL
* @memberof ept
* @param {string} url URL (preferably to allitems.aspx)
* @returns {Array}  site and listname as an array
*/
  ept.getSiteAndListFromURL = function ( url ) {
    var results = [], site = '', list = '', tmp = '';
    tmp = url.toLowerCase();
    tmp = tmp.split('?')[0];
    tmp = tmp.split('#')[0];
    tmp = tmp.slice( 0, url.lastIndexOf( '.' ) );
    site = tmp.slice( 0, tmp.lastIndexOf( '/lists/' ) );
    site = site.replace( ept.url.protocol, '' ).replaceAll( ept.url.host + '/', '' );
    results[0] = site.replaceAll( '//', '/' );
    list = tmp.slice( tmp.lastIndexOf( '/lists/' ), tmp.length );
    list = list.slice( 0, list.lastIndexOf( '/' ) );
    list = list.replaceAll( '//', '/' );
    results[1] = list.replace( '/lists/', '' );
    return results;
  };


/**
* Returns a Promise from a given REST call
* @function ajax
* @memberof ept
* @param {object} json  Object contains all of the information needed to do ajax call
* @returns {object}  A jQuery Promise object
*/
  ept.ajax = function ( json ) {
      var url = json.url || 'false',
        timeout = json.timeout || 15000,
        datatype = json.datatype || 'json',
        async = json.async || true,
        data = json.data || '',
        type = json.type || 'GET',
        contenttype = ( datatype.toLowerCase() === 'json' ) ? 'application/json; charset=utf-8' : '';
      return $.ajax( { headers: { 'accept' : 'application/json; odata=verbose' },
        url: url, timeout: timeout, dataType: datatype, async: async, data: data,
        contentType: contenttype, type: type
      } ).promise();
  };

/**
* Adds a given script to the current page and executes an optional function when loaded
* @function loadJS
* @memberof ept
* @param {string} scrpt  URL to script file to load
* @param {string} [fn]  Optional. Name of function or function expression to execute
*/
  ept.loadJS =  function ( scrpt, fn ) {
    var el = document.createElement('script'),
        body = document.body;

        el.type = 'text/javascript';
        el.src = scrpt;
        if ( typeof fn === 'function' ) {
          el.onload = fn();
        }
        body.appendChild(el);
  };

/**
* Adds a given CSS file to the current page and executes an optional function when loaded
* @function loadCSS
* @memberof ept
* @param {string} scrpt  URL to CSS file to load
* @param {string} [fn]  Optional. Name of function or function expression to execute
*/
 ept.loadCSS =  function ( scrpt, fn ) {
    var el = document.createElement('link'),
        body = document.head;

        el.type = 'text/css';
        el.media = 'all';
        el.rel = 'stylesheet';
        el.href = scrpt;
        if ( typeof fn === 'function' ) {
          el.onload = fn();
        }
        body.appendChild(el);
  };

/**
* Stores information in local/session storage
* @function store
* @memberof ept
* @param {string} key  Name to store information as.
* @param {string} val  Information to store
* @param {string} [location]  Optional. Session or Local defaults to Local
*/
  ept.store = function( key, val, location ) {
    location = location || '';
    if (location.toString().toLowerCase() === 'session') { sessionStorage.setItem( key, val ); return this; }
    localStorage.setItem( key, val );
    return this;
  };

/**
* Retrieves information from local/session storage
* @function retrieve
* @memberof ept
* @param {string} key  Name of information to retreive.
* @returns {string} Information stored in [key]
*/
  ept.retrieve = function( key ) {
    var val = localStorage.getItem( key );
    if ( !val ) { val = sessionStorage.getItem( key ); }
    return ( val ) ? val : false;
  };

/**
* Creates a cookie named {key} with {val} information for {days} number of days
* @function setCookie
* @memberof ept
* @param {string} key  Name to store information as.
* @param {string} val  Information to store
* @param {string} [days]  Optional. Number of days to store the cookie
*/
  ept.setCookie =  function( key, val, days ) {
      var exdate = new Date();
      exdate.setDate( exdate.getDate() + days );
      val = encodeURI( val ) + ( ( days === null ) ? '' : '; expires=' + exdate.toUTCString() );
      document.cookie = key + '=' + val;
  };

/**
* Retrieves information from cookie {key}
* @function getCookie
* @memberof ept
* @param {string} key Name of information (cookie) to retreive.
* @returns {string} Information stored in cookie.
*/
  ept.getCookie =  function( key ){
     var i=0, x='', y='', cookies = document.cookie.split(';'),l=cookies.length;
      for (i=l;i--;) {
          x = cookies[i].substr( 0, cookies[i].indexOf('=') );
          y = cookies[i].substr( cookies[i].indexOf('=') + 1);
          x = x.replace(/^\s+|\s+$/g, '');
          if (x === key) {
              return decodeURIComponent(y);
          }
      }
  };

})( jQuery, window, document, ept );

// requires prototypes.js base.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ){

  'use strict';

  var epttoday = new Date();
/**
 * Date/Time properties
 * @namespace ept.date
 */
  ept.date = {
/**
* Current Date/Time
* @property {date} today Current Date/Time
* @memberof ept.date
*/
    today : epttoday,
/**
* Current Day as two-digit string
* @property {string} day Current Day as two-digit string
* @memberof ept.date
*/
    day : epttoday.getDate().toString().pad(2),
/**
* Current Month as two-digit string
* @property {string} day Current Month as two-digit string
* @memberof ept.date
*/
    month : (epttoday.getMonth()+ 1).toString().pad(2),
/**
* Current Year as four-digit string
* @property {string} day Current Year as four-digit string
* @memberof ept.date
*/
    year : epttoday.getFullYear() + '',
/**
* Current Hours as two-digit string
* @property {string} day Current Hours as two-digit string
* @memberof ept.date
*/
    hours : epttoday.getHours().toString().pad(2),
/**
* Current Minutes as two-digit string
* @property {string} day Current Minutes as two-digit string
* @memberof ept.date
*/
    minutes : epttoday.getMinutes().toString().pad(2),
/**
* Current Seconds as two-digit string
* @property {string} day Current Seconds as two-digit string
* @memberof ept.date
*/
    seconds : epttoday.getSeconds().toString().pad(2),
/**
* Number of milliseconds since 1/1/1070
* @property {number} day Number of milliseconds since 1/1/1070
* @memberof ept.date
*/
    now : epttoday.getTime(),
/**
* Number of milliseconds in a week
* @property {number} day Number of milliseconds in a week
* @memberof ept.date
*/
    oneweek : 86400000*7,
/**
* Number of milliseconds in two days
* @property {number} day Number of milliseconds in two days
* @memberof ept.date
*/
    twodays : 86400000*2
  };

/**
* Returns a datetime string in the correct format for using the SP REST API's.
* @function spdatetime
* @memberof ept
* @param {string} date = A datetime object or string representing a date
* @param {string} [options] = Additional REST arguments
* @returns {string} Date converted to fomat for SP REST APIs
*/
  ept.spdatetime = function( d ) {
    //specifically using double quotes because of required single quoes in the string
    var str='';
    d = new Date(d);
    str += "datetime'" + d.getFullYear().toString() + "-" + (d.getMonth()+1).toString().pad(2) + "-" + d.getDate().toString().pad(2) + "";
    str += "T" + d.getHours().toString().pad(2) + ":" + d.getMinutes(2).toString().pad(2) + ":" + d.getSeconds().toString().pad(2) + "'";
    return str;
  };

/**
* Gets the difference between to date/tims and returns a simple string with the difference
* @function prettyDate
* @memberof ept
* @param {string} time = A datetime object or string representing a date
* @param {string} [now] = Default: Current Date/Time. A datetime object or string representing a date
* @returns {string} A string representing the time difference (ex: 10 minutes ago , etc.)
*/
  ept.prettyDate = function (  time, now ) {
    var date = new Date( time || ''),
        curr = new Date( now || epttoday );

        var diff = ( ( curr.getTime() - date.getTime() ) / 1000 ),
        day_diff = Math.floor( diff / 86400 ), result;

    if ( isNaN( day_diff ) || day_diff < 0 || day_diff >= 31 ) { return; }

    result = day_diff === 0 &&
      (   diff < 60 && 'just now' || diff < 120 && '1 minute ago' ||
          diff < 3600 && Math.floor(diff / 60) + ' minutes ago' ||
          diff < 7200 && '1 hour ago' ||
          diff < 86400 && Math.floor(diff / 3600) + ' hours ago'
      ) ||
          day_diff === 1 && 'Yesterday' || day_diff < 7 && day_diff + ' days ago' ||
          day_diff < 31 && Math.ceil( day_diff / 7) + ' weeks ago';

    return result;
  };

  epttoday = null;

}(jQuery, window, document, ept));

/*global jQuery */

( function( $, window, document, undefined ){
'use strict';

  $.pluck = function(arr, key) {
      return $.map(arr, function(e) { return e[key]; });
  };

  $.fn.hasAttr = function( name ) {
      for ( var i = 0, l = this.length; i < l; i++ ) {
          if ( ( this.attr( name ) !== undefined ) ) {
              return true;
          }
      }
      return false;
  };

})(jQuery, window, document);

// requires base.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ) {

  'use strict';

/**
 * Contains references to all keys (ex: ept.keys.TAB, ept.keys.ENTER, etc)
 * @namespace ept.keys
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent?redirectlocale=en-US&redirectslug=DOM%2FKeyboardEvent
 */
  ept.keys = {
    //Reference at https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent?redirectlocale=en-US&redirectslug=DOM%2FKeyboardEvent
    CANCEL : 3, HELP : 6, BACKSPACE : 8, TAB : 9, CLEAR : 12, ENTER : 13, SHIFT : 16, CTRL : 17, CONTROL: 17, ALT : 18, OPTION : 18,
    PAUSE: 19, CAPSLOCK :20, ESC : 27, ESCAPE : 27, SPACE : 32, PAGEUP : 33, PAGEDOWN : 34, END: 35, HOME : 36, LEFTARROW : 37,
    UPARROW : 38, RIGHTARROW : 39, DOWNARROW : 40, PRINTSCREEN : 44, PRINT : 44, INSERT : 45, INS : 45, DELETE : 46, ZERO : 48,
    ONE : 49, TWO : 50, THREE : 51, FOUR : 52, FIVE : 53, SIX : 54, SEVEN : 55, EIGHT : 56, NINE : 57, COLON : 58, SEMICOLON : 59,
    LESSTHAN : 60, EQUAlS : 61, GREATERTHAN : 62, QUESTIONMARK : 63, AT : 64, WIN : 91, WINDOWS:91, CONTEXTMENU : 93, NUMPAD0 : 96,
    NUMPAD1 : 97, NUMPAD2 : 98, NUMPAD3 : 99, NUMPAD4 : 100, NUMPAD5 : 101, NUMPAD6 : 102, NUMPAD7 : 103, NUMPAD8 : 104, NUMPAD9 : 105,
    NUMPADMULTIPLY : 106, NUMPADADD : 107, NUMPADSUBTRACT : 109, NUMPADDECIMAL : 110, NUMPADDIVIDE : 111, F1 : 112, F2 : 113, F3 : 114,
    F4 : 115, F5 : 116, F6 : 117, F7 : 118, F8 : 119, F9 : 120, F10 : 121, F11 : 122, F12 : 123, F13 : 124, F14 : 125, F15 : 126,
    F16 : 127, F17 : 128, F18 : 129, F19 : 130, F20 : 131, F21 : 132, F22 : 133, F23 : 134, F24 : 135, NUMLOCK : 144, SCROLLLOCK : 145,
    CIRCUMFLEX : 160, CARET : 160, EXCLAMATION : 161, DOUBLEQUOTE : 162, HASH : 163, DOLLAR : 164, PERCENT : 165, ANDPERSAND : 166,
    AND : 166, UNDERSCORE : 167, OPENPAREN : 168, CLOSEPAREN : 169, ASTERISK : 170, PLUS : 171, PIPE : 172, HYPHEN : 173, MINUS : 173,
    OPENCURLY : 174, CLOSECURLY : 175, TILDE : 176, VOLUMEMUTE : 181, VOLUMEDOWN : 182, VOLUMEUP : 183, COMMA : 188, PERIOD : 189, SLASH : 190,
    BACKQUOTE : 191, OPENBRACKET : 219, BACKSLASH : 220, CLOSEBRACKET : 221, QUOTE : 222, META : 224, COMMAND : 224
  };

/**
* Returns true/false if the {key} is used in the {event}
* @function compareKey
* @memberof ept
* @param {object} event = jQuery event object
* @param {string} key = key to compare
* @returns {boolean}
*/
  ept.compareKey = function ( event , key ) {
    return ept.isTrue( ept.getKey( event ) === key);
  };

/**
* Returns the key value from an event object
* @function getKey
* @memberof ept
* @param {object} event = jQuery event object
* @returns {number} the value of the key in the event
*/
  ept.getKey = function ( event ) {
    return (event.keyCode ? event.keyCode : event.which);
  };

})(jQuery, window, document, ept);

/*global jQuery ept window document */

( function ($, window, document, ept ) {

  'use strict';

  var apiUrl = "/_api/lists/getbytitle('{{listName}}')";

  function getSPList( obj ) {
    var itemurl = buildUrl( obj );
    return $.ajax({
      url: itemurl,
      method: 'GET',
      headers: { 'Accept': 'application/json; odata=verbose' }
    });
  }

  function createSPList( obj ) {
    var itemurl = buildUrl( obj );
    var itemdata = {
      '__metadata' : {
        'type' : getSPListType( obj.list )
      }
    };

    var data = $.extend( true, {}, itemdata , obj.data );

    return $.ajax({
        url: itemurl,
        type: 'POST',
        contentType: 'application/json;odata=verbose',
        data: JSON.stringify( data ),
        headers: {
            'Accept': 'application/json;odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val()
        }
    });
  }

  function updateSPList( obj ) {

    return $.ajax({
      url: obj.__metadata.uri,
      type: 'POST',
      contentType: 'application/json;odata=verbose',
      data: JSON.stringify( obj ),
      headers: {
          'Accept': 'application/json;odata=verbose',
          'X-RequestDigest': $('#__REQUESTDIGEST').val(),
          'X-HTTP-Method': 'MERGE',
          'If-Match': obj.__metadata.etag
      }
    });
  }

  function deleteSPList( obj ) {
    return $.ajax({
            url: obj.__metadata.uri.replace('/deleteObject()','')+'/recycle()',
            type: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'X-Http-Method': 'DELETE',
                'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                'If-Match': obj.__metadata.etag
            }
    });
  }

/*Helper Functions*/

  function getSPListType( listName ) {
    return 'SP.Data.' + listName.charAt(0).toUpperCase() + listName.split(' ').join('').slice(1) + 'ListItem';
  }

  function buildUrl( obj ) {
    var itemurl = apiUrl.replace( '{{listName}}', obj.list );
    itemurl = ( obj.site ) ? obj.site + itemurl : '';
    itemurl = replaceAll(itemurl,'//','/');
    itemurl += ( obj.options ) ? ( ( itemurl.indexOf('?') >-1 ) ? '&'+obj.options : '?'+obj.options ) : '';
    return itemurl;
  }

  function replaceAll(s, f, r) {
    while ( s.indexOf(f)>-1) {
      s=s.replace(f,r);
    }
    return s;
  }

  ept.list = {
    get: getSPList,
    add : createSPList,
    update : updateSPList,
    delete : deleteSPList
 };

})( jQuery, window, document, ept );

// requires prototypes.js base.js
/*global jQuery */
/*global ept */

( function ($, window, document, ept ) {

  'use strict';

/**
 * Functions for manipulating items in a Sharepoint List
 * @namespace ept.listItem
 */

/*** See documentaion at bottom of file ***/

  var apiUrl = "/_api/lists/getbytitle('{{listName}}')/items";

  function getSPListItems( obj ) {
    var itemurl = buildUrl( obj );
    return $.ajax({
      url: itemurl,
      method: 'GET',
      headers: { 'Accept': 'application/json; odata=verbose' }
    });
  }

  function getSPListItem( obj ) {
    var itemurl = buildUrl( obj );
    itemurl += ( itemurl.indexOf('?')>-1 ) ? '&$filter=Id eq ' + obj.data.Id : '?$filter=Id eq ' + obj.data.Id;
    return $.ajax({
      url: itemurl,
      method: 'GET',
      headers: { 'Accept': 'application/json; odata=verbose' }
    });
  }

  function createSPListItem( obj ) {
    var itemurl = buildUrl( obj );
    var itemdata = {
      '__metadata' : {
        'type' : getSPListType( obj.list )
      }
    };

    var data = $.extend( true, {}, itemdata , obj.data );

    return $.ajax({
        url: itemurl,
        type: 'POST',
        contentType: 'application/json;odata=verbose',
        data: JSON.stringify( data ),
        headers: {
            'Accept': 'application/json;odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val()
        }
    });
  }

  function updateSPListItem( obj ) {

    return $.ajax({
      url: obj.__metadata.uri,
      type: 'POST',
      contentType: 'application/json;odata=verbose',
      data: JSON.stringify( obj ),
      headers: {
          'Accept': 'application/json;odata=verbose',
          'X-RequestDigest': $('#__REQUESTDIGEST').val(),
          'X-HTTP-Method': 'MERGE',
          'If-Match': obj.__metadata.etag
      }
    });
  }

  function updateItem( obj ) {
    var dfd = $.Deferred( function( dfd ) {
      $.when( getSPListItem( obj ) ).done( function getForUpdate( data ) {
        if (data.d.results.length) {
          var tmp=data.d.results[0];
          obj.data.__metadata = tmp.__metadata;
          $.when ( updateSPListItem( obj.data ) ).done( function performUpdate( data ) {
            dfd.resolve( data );
          }).fail( function performUpdateFailed() {
            dfd.reject( data );
          });
        } else {
          dfd.reject( data );
        }
      }).fail( function getForUpdateFailed( data ) {
          dfd.reject( data );
      });
    });
    return dfd;
  }


  function deleteSPListItem( obj ) {

    var url = obj.__metadata.uri;
    url = (obj.recyce) ? url.replace('/deleteObject()','')+'/recycle()' : url;

    return $.ajax({
            url: url,
            type: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'X-Http-Method': 'DELETE',
                'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                'If-Match': obj.__metadata.etag
            }
    });
  }

  function deleteItem( obj ) {
    var dfd = $.Deferred( function( dfd ) {
      $.when( getSPListItem( obj ) ).done( function getForDelete( data ) {
        if (data.d.results.length) {
          data = $.extend( true, {}, data.d.results[0] , obj.data );
          $.when ( deleteSPListItem( data ) ).done( function performDelete( data ) {
              dfd.resolve( data );
            }).fail( function perdormDeleteFailed() {
              dfd.reject( data );
            });
        } else {
          dfd.reject( data );
        }
      }).fail( function getForDeleteFailed( data ) {
        dfd.reject( data );
      });
    });
    return dfd;
  }




/*Helper Functions*/

  function getSPListType( listName ) {
    return 'SP.Data.' + listName.charAt(0).toUpperCase() + listName.split(' ').join('').slice(1) + 'ListItem';
  }

  function buildUrl( obj ) {
    var itemurl = apiUrl.replace( '{{listName}}', obj.list );
    itemurl = ( obj.site ) ? obj.site + itemurl : '';
    itemurl = replaceAll(itemurl,'//','/');
    itemurl += ( obj.options ) ? ( ( itemurl.indexOf('?') >-1 ) ? '&'+obj.options : '?'+obj.options ) : '';
    return itemurl;
  }

  function replaceAll(s, f, r) {
    while ( s.indexOf(f)>-1) {
      s=s.replace(f,r);
    }
    return s;
  }

/**
* Retrieve items from a Sharepoint List
* @function get
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName and options (optional REST parameters)
* @returns {object} Returns a jQuery Promise.
* @example
*   $.when( ept.listItem.get({
*               site: "/",
*               list: "Tasks",
*               options: '$orderby=Titile asc'
*            })).done(function() {});
*/

/**
* Retrieves a specific item from a Sharepoint List
* @function getById
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName and options (optional REST parameters)
* @returns {object} Returns a jQuery Promise.
*/
/**
* Adds a new item to a Sharepoint List
* @function add
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName, options (optional REST parameters) and data (JSON object) containing information for list item.
* @returns {object} Returns a jQuery Promise.
*/
/**
* Updates an existing item in a Sharepoint List
* @function update
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName, options (optional REST parameters) and data (JSON object) containing information for list item.
* @returns {object} Retuens a jQuery Promise.
*/
/**
* Removes a specific item from a Sharepoint List
* @function delete
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName, options (optional REST parameters) and data (JSON object) containing information for list item.
* @returns {object} Retuens a jQuery Promise.
*/
 ept.listItem = {
    get: getSPListItems,
    getById : getSPListItem,
    add : createSPListItem,
    update : updateItem,
    delete : deleteItem
  };

})( jQuery, window, document, ept );

//requires base.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ) {

  'use strict';

  ept.plugins = {};

  ept.plugins.init = function() {
    ept.log('ept.plugins.init');
    if ( !ept.isEditMode() ) {
      ept.plugins.tabs();
    }
  };

  ept.plugins.tabs = function() {
    ept.log('ept.plugins.tabs');
    var tabs = $('.macys-tab-webpart');
    if ( tabs.length ) {
      $.getScript('/_layouts/15/MyMacys/scripts/ept.tabs.min.js', function loadTabScript() {
        tabs.macysTabs();
      });
    }
  };

  ept.onLoad('ept.plugins.init');

}(jQuery, window, document, ept));


/*Add function that is broken in SP2013 */
( function( $, window ) {

  'use strict';

  //ShowHidePrivacyRow('SPS_QLMICSRCHRES','1', '1SPS_QLMICSRCHRES_Link', 'Hide 5 additional links', 'Show 5 additional links');
  function ShowHidePrivacyRow( table, unknown, link, hide, show ) {
    link = $('#'+link);
    table = $('#'+table);
    unknown ='';
    var txt = link.text();
    var hidden = table.find('.groupHide');
    if (hidden.length) {
      hidden.toggleClass('groupHide').toggleClass('js-groupShow');
    } else {
      table.find('.js-groupShow').toggleClass('js-groupShow').toggleClass('groupHide');
    }
    if (txt.indexOf( 'Hide') > -1 ) {
      link.html( '<img src="/_layouts/images/downarrow.png" align="absmiddle"/>'+show );
    } else {
      link.html( '<img src="/_layouts/images/uparrow.png" align="absmiddle"/> '+hide );
    }
  }

  window.ShowHidePrivacyRow = ShowHidePrivacyRow;

})( jQuery, window );


// requires prototypes.js base.js
(function( window, document, ept ) {

    'use strict';

/**
 * Simple templating functions
 * @namespace ept.template
 */
/*** See documentaion at bottom of file ***/


    var cache = [];  /* Stores templates */
    var tStart = '{{';
    var tEnd = '}}';

    function setTemplate( name, data ) {
      if ( ! hasTemplate( name ) ) { cache[ name ] = data; return data; } else { return false; }
    }
    function getTemplate( name , data ){
      var tmpl =  (name.indexOf('#') === 0 ) ? getDomElement( name ) : ( cache[name] || false );
      return ( data && parseTemplate( tmpl, data ) ) || tmpl;
    }

    function getDomElement( name ) {
      name = name.replace('#','') + '';
      if ( document && name ) {
        return document.getElementById( name ).innerText;
      }
      return false;
    }

    function hasTemplate( name ) { return !!( cache[ name ] ); }

    function parseTemplate( template, data ) {
      var len, str='';
      if ( data.constructor === Array ) {
        len = data.length;
        while (len--) {
          str += replaceValues( template, data[len] );
        }
      } else {
        str = replaceValues( template, data );
      }
      return str;
    }

    function setTemplateString(str) {
      var t = str.split('x');
      tStart=t[0] || '{{';
      tEnd=t[1] || '}}';
    }

    function replaceValues( template, data ) {
      if ( template ){
        return template.replace(/{{([a-z_]+[a-z0-9_]*)}}/gi, function( tag, val ) {
          if (data[val] ===0) { data[val] = data[val]+''; }
          return  (!data[val]) ? tStart+val+tEnd : data[ val ];
        });
      } else {
        return '';
      }
    }

/**
* Retrieve an existing template string
* @function get
* @memberof ept.template
* @param {string} name = Name of the template string
* @param {array/object} [data] = An array of JSON objects or JSON object containing data to place in template
* @returns {string} Returns parsed template string
*/
/**
* creates a new template string
* @function set
* @memberof ept.template
* @param {string} name = Name of the template string
* @param {string} data =  The template string
* @returns {string} Returns unparsed template string
*/
/**
* Checks to see if template string with {name} exists
* @function has
* @memberof ept.template
* @param {string} name = Name of the template string
* @returns {boolean} Returns true/false if template string exists
*/
    ept.template = {
      get : getTemplate,
      set : setTemplate,
      has : hasTemplate,
      use : setTemplateString
    };

})( window, document, ept );

// requires base.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ){
  'use strict';
/**
* Checks to see if the given value is truth-y. Additionally, a string "false" will return false.
* @function isTrue
* @memberof ept
* @param {string/number/boolean} val The value to check
* @returns {boolean} Returns true/false
*/
  ept.isTrue = function ( val ) {
      if ( typeof val === 'string' ) { val = val.toLowerCase(); }
        return ( val === 'false' ) ? false : Boolean( val );
  };

/**
* Checks to see if the given values are equal by value and type
* @function strictEqual
* @memberof ept
* @param {string/number/boolean} val The first value to compare
* @param {string/number/boolean} val The second value to compare
* @returns {boolean} Returns true/false
*/
  ept.strictEqual = function ( a, b ) {
    return ( a === b );
  };

/**
*Simple assertion checks
* @function assert
* @memberof ept
* @param {string} name A string to name the assertion
* @param {string/number/boolean} value1 The first value to compare
* @param {string/number/boolean} value2 The second value to compare
* @param {string} msg The message to display if the assertion passes
* @returns {boolean} Returns success/failure string
*/
  ept.assert = function ( name, a, b, msg ) {
    return (ept.strictEqual(a,b)) ? name+':'+msg : name + ' failed!';
  };

})( jQuery, window, document, ept );

( function ( undefined ) {

'use strict';
var Tile,TileSet;

/*eslint-disable no-unused-vars */
var createTileSet = function() {
	var obj = {
		data 		: {},
		width 		: undefined,
		height 		: undefined,
		id 			: undefined,
		startAt		: undefined,
		startHeight	: undefined,
		startWidth 	: undefined,
		display    	: undefined,
		parent 		: undefined,
		el 			: undefined
	};
	obj.prototype = TileSet.prototype;
	return obj;
};

var createTile = function() {
	var obj = {
		data 		: {},
		badge 		: '',
		set 		: undefined,
		column 		: undefined,
		row 		: undefined,
		icon		: undefined,
		size 		: undefined,
		color 		: undefined,
		url 		: undefined,
		target 		: undefined,
		title 		: undefined,
		description : undefined,
		id 			: undefined,
		type 		: undefined,
		el 			: undefined,
		parent 		: undefined
	};
	obj.prototype = Tile.prototype;
	return obj;
};
/*eslint-enable no-unused-vars */

Tile = function () {
  var obj, ret;

  if ( this instanceof Tile ) {

	this.data 			= {};
	this.badge 			= '';
	this.set 			= undefined;
	this.column 		= undefined;
	this.row 			= undefined;
	this.icon			= undefined;
	this.size 			= undefined;
	this.color 			= undefined;
	this.url 			= undefined;
	this.target 		= undefined;
	this.title 			= undefined;
	this.description 	= undefined;
	this.id 			= undefined;
	this.type 			= undefined;
	this.el 			= undefined;
	this.parent 		= undefined;

  } else {

    obj = new Tile();
    ret = Tile.apply( obj, arguments );
    return ( ret === undefined ) ? obj : ret;

  }
};

Tile.prototype.init = function () {

	if ( typeof this.data === 'string' ) {
		try {
			this.data = JSON.parse( this.data );
		} catch( e ) {
			throw new Error( 'Tile Error: Unable to parse json data.' );
		}
	}

	this.url 				= ( this.url ) 				? this.url 				: ( this.data && this.data.url ) 			? this.data.url 			: undefined;
	this.id 				= ( this.id ) 				? this.id 				: ( this.data && this.data.id ) 			? this.data.id 				: undefined;
	this.title 				= ( this.title ) 			? this.title 			: ( this.data && this.data.title ) 			? this.data.title 			: undefined;

	this.set 				= ( this.set ) 				? this.set+'' 			: ( this.data && this.data.set ) 			? this.data.set+'' 			: '1';
	this.column 			= ( this.column )		 	? this.column 			: ( this.data && this.data.column ) 		? this.data.column			: 'A';
	this.row 				= ( this.row ) 				? this.row 				: ( this.data && this.data.row ) 			? this.data.row 			: 1;
	this.icon				= ( this.icon )			 	? this.icon 			: ( this.data && this.data.icon ) 			? this.data.icon 			: 'None';
	this.badge				= ( this.badge )		 	? this.badge 			: ( this.data && this.data.badge ) 			? this.data.badge			: 0;
	this.size 				= ( this.size ) 			? this.size 			: ( this.data && this.data.size ) 			? this.data.size 			: '2x2';
	this.color 				= ( this.color ) 			? this.color 			: ( this.data && this.data.color ) 			? this.data.color			: 'Gray';
	this.target 			= ( this.target ) 			? this.target 			: ( this.data && this.data.target )			? this.data.target			: '';
	this.type 				= ( this.type ) 			? this.type 			: ( this.data && this.data.type )			? this.data.type 			: 'standard';
	this.description 		= ( this.description ) 		? this.description 		: ( this.data && this.data.description )	? this.data.description		: '';
	this.tiledescription 	= ( this.tiledescription ) 	? this.tiledescription 	: ( this.data && this.data.tiledescription )? this.data.tiledescription : '';
	this.hasDescription 	= ( this.hasDescription ) 	? this.hasDescription 	: ( this.data && this.data.hasDescription )	? this.data.hasDescription	: '';
	this.parent 			= ( this.parent ) 			? this.parent 			: ( this.data && this.data.parent )			? this.data.parent 			: undefined;

	if ( ! this.set   )	{ throw new Error( 'Tile Error: Tileset has not been defined.' ); }
	if ( ! this.url   )	{ throw new Error( 'Tile Error: URL has not been defined.' ); }
	if ( ! this.title )	{ throw new Error( 'Tile Error: Title has not been defined.' ); }

	this.id = this.id || this.private.uniqueName( this );
	if ( ! this.id   )	{ throw new Error( 'Tile Error: ID has not been defined.' ); }

	this.hasBadge =  ( !this.badge ) ? 'macys-tile-no-badge' : 'macys-tile-has-badge';
	this.grouptileclass = ( this.type === 'group' ) ? 'macys-tile-popup' : '';
	this.tilelocation = this.column + this.row + '';

	this.hasDescription =  ( this.size === '1x1' || this.size === '2x1' || this.size === '1x2' ) ? 'macys-tile-no-desc' : (this.hasDescription)?this.hasDescription: 'macys-tile-no-desc' ;
};

Tile.prototype.add = function () {
	var html = '';
	this.init();
	this.data = this.templates.toJson( this );
	html = this.private.build( this );
	this.parent.appendChild( this.private.convertToElement( html ) );
	this.el = ( this.id ) ? document.getElementById( this.id ) : this.parent.querySelector( '[data-location=' + this.column + this.row + ']' );
	return this;
};

Tile.prototype.remove = function ( ) {
	var el = document.getElementById( this.id );
	el.parentNode.removeChild( el );
};

Tile.prototype.update = function () {
	this.remove(); this.add();
};

Tile.prototype.get = function ( id ) {
	this.data = document.getElementById( id ).getAttribute('data-tile');
	this.init();
};

Tile.prototype.private = {};

Tile.prototype.private.build = function ( x ) {
	var tmpl = x.private.templates.base();
	var type= x.type.toLowerCase();
	if (type === 'weather' || type === 'stocks') { x.type='standard'; }
	tmpl = x.private.replaceAll( tmpl, '{{html}}', x.templates[x.type]() );
	for (var prop in x ) {
		if( x.hasOwnProperty( prop ) ) {
			tmpl = x.private.replaceAll( tmpl, '{{'+prop+'}}', x[prop] );
		}
	}
	return tmpl;
};

Tile.prototype.private.convertToElement = function ( html ) {
	var el = document.createElement( 'div' );
	el.innerHTML = html;
	return el.firstChild;
};

Tile.prototype.private.uniqueName = function ( x ) {
	var tmp = 'tile-' + x.set.toString() + '-' + x.title.toString();
	return tmp.toLowerCase().replace(/\s+/g, '');
};

Tile.prototype.private.replaceAll = function ( str, find , replace ) {
  var re = new RegExp(find, 'g');
	return str.replace(re, replace);
};

Tile.prototype.private.templates = {};

Tile.prototype.private.templates.base = function () {
	return '<div id="{{id}}" data-tile-set="{{set}}" data-tile-type="{{type}}" data-location="{{tilelocation}}" class="macys-tile macys-tile-size-{{size}} macys-tile-color-{{color}} macys-tile-row{{row}} macys-tile-col{{column}} animated fadeIn" title="{{tiledescription}}" data-tile=\'{{data}}\' >'+
            '<a class="{{grouptileclass}} {{hasDescription}} {{hasBadge}}" href="{{url}}" target="{{target}}"  title="{{tiledescription}}">' +
              '<div class="macys-tile-html">{{html}}</div>' +
            '</a>'+
         '</div>';
};

Tile.prototype.templates = {};

Tile.prototype.templates.standard = function () {
	return	'<div class="macys-tile-front">'+
				'<div class="macys-tile-badge">{{badge}}</div>' +
				'<div class="macys-tile-main-icon macys-tile-icon macys-tile-icon-{{icon}}"></div>' +
				'<div class="macys-tile-BottomCenter macys-tile-title">{{title}}</div>'+
			'</div>'+
			'<div class="macys-tile-back">'+
				'<div class="macys-tile-back-header">{{title}}</div>' +
				'<div class="macys-tile-back-desc">{{description}}</div>' +
			'</div>' ;
};

Tile.prototype.templates.group = function () {
  return	'<div class="macys-tile-group macys-tile-no-desc macys-tile-front">'+
				'<div class="macys-tile-icon macys-tile-TopLeft macys-tile-icon-waffle"></div>' +
				'<div class="macys-tile-badge">{{badge}}</div>' +
				'<div class="macys-tile-main-icon macys-tile-icon macys-tile-icon-{{icon}}"></div>' +
				'<div class="macys-tile-BottomCenter macys-tile-title">{{title}}</div>'+
			'</div>'+
			'<div class="macys-tile-back">'+
				'<div class="macys-tile-back-header">{{title}}</div>' +
				'<div class="macys-tile-back-desc">{{description}}</div>' +
			'</div>' ;
};

Tile.prototype.templates.weather = function () {
  return	'<div class="macys-tile-weather macys-tile-no-desc">' +
				'<div class="macys-tile-weather-icon"><img src="{{image}}"/></div>' +
				'<div class="macys-tile-weather-temperature">{{temperature}}°</div>' +
				'<div class="macys-tile-weather-high">{{lowtemp}}° &nbsp;-&nbsp; {{hightemp}}°</div>' +
				'<div class="macys-tile-BottomCenter macys-tile-title">'+
					'<div class="macys-tile-header">{{title}}</div>'+
				'</div>' +
			'</div>';
};

Tile.prototype.templates.stocks = function () {
  return	'<div class="macys-tile-stocks macys-tile-no-desc">' +
				'<div class="macys-tile-stocks-date">{{date}}</div>' +
                '<div class="macys-tile-stocks-trend macys-tile-stocks-trend-{{trend}} macys-icon-{{trend}}"></div>' +
                '<div class="macys-tile-stocks-value">{{value}}</div>' +
                '<div class="macys-tile-stocks-change">{{change}}&nbsp;<span class="macys-tile-stocks-percentage">{{percent}}</span><span class="macys-linktile-super"><super>*</super></span></div>' +
				'<div class="macys-tile-BottomCenter macys-tile-title">'+
					'<div class="macys-tile-header">{{title}}</div>'+
				'</div>'+
            '</div>';
};

Tile.prototype.templates.toJson = function ( x ) {
	var tmp ='{';
	for( var prop in x ) {
		if( x.hasOwnProperty( prop ) ) {
            switch(prop){
                case 'el':
					tmp +='"'+prop+'" : "'+x['id']+'",';
                    break;
                case 'parent':
					tmp +='"'+prop+'" : "'+x[prop].id+'",';
                    break;
                case 'data':
                    break;
                default:
					tmp +='"'+prop+'" : "'+x[prop]+'",';
                    break;
            }
		}
	}
	tmp = tmp.slice( 0, ( tmp.length - 1 ) ) + '}';
	return tmp;
};

window.Tile = Tile;

/***************************************************** */
/***************************************************** */
/***************************************************** */

TileSet = function () {

  var obj, ret;

  if ( this instanceof TileSet ) {

	this.data 			= {};
	this.width 			= undefined;
	this.height 		= undefined;
	this.id 			= undefined;
	this.startAt		= undefined;
	this.startHeight 	= undefined;
	this.startWidth 	= undefined;
	this.display     	= undefined;
	this.parent 		= undefined;
	this.el 			= undefined;

  } else {

    obj = new TileSet();
    ret = TileSet.apply( obj, arguments );
    return ( ret === undefined ) ? obj : ret;

  }
};

TileSet.prototype.init = function () {

	this.id 	= ( this.id ) 		? this.id 		: ( this.data.id ) 		? this.data.id 		: undefined;
	this.width 	= ( this.width ) 	? this.width	: ( this.data.width ) 	? this.data.width 	: 2;
	this.height = ( this.height )	? this.height	: ( this.data.height ) 	? this.data.height 	: 1;
	this.startAt= ( this.startAt ) 	? this.startAt	: ( this.data.startAt ) ? this.data.startAt : 'A1';
	this.display= ( this.display ) 	? this.display	: ( this.data.display ) ? this.data.display : 'show';

	if ( ! this.id )	{
		this.id = this.private.uniqueName( this );
	}

	if ( ! this.parent )	{ throw new Error( 'TileSet Error: Parent has not been defined.' ); }

	this.private.getStart( this );
	this.private.build( this );
};

TileSet.prototype.getId = function() {
	return this.id;
};

TileSet.prototype.add = function ( arr ) {
	var i = 0, len = arr.length, t;
	for ( ; i < len ; i++ ) {
		t = new Tile();
		arr[i].parent = this.el;
		t.data = arr[i];
		t.add();
	}
};

TileSet.prototype.private = {};

TileSet.prototype.private.templates = {};

TileSet.prototype.private.templates.tileset = function () {
	return '<div id="{{id}}" class="macys-tile-container macys-tile-container-height-{{height}} macys-tile-container-width-{{width}} macys-tile-{{display}} " data-tileset="{{id}}"></div>';
};

TileSet.prototype.private.getStart = function ( x ) {
	var curr = 0, len = x.startAt.length, row = '', col = '', test, irow;
	for (; curr < len; curr++ ) {
		test = x.startAt.charAt( curr ) + '';
		if ( '0123456789'.indexOf( test ) > -1 ) {
			row += test.trim();
		} else {
			col += test.trim();
		}
	}

	if ( col.length === 0 ) {
		throw new Error( 'TileSet Error: Invalid starting location (column).' );
	}
	irow = parseInt( row, 10 );
	if ( irow < 1 || irow > 13 ) {
		throw new Error( 'TileSet Error: Invalid starting location (row).' );
	}
	x.startHeight = col;
	x.startWidth = row;
};

TileSet.prototype.private.convertToElement = function ( html ) {
	var el = document.createElement( 'div' );
	el.innerHTML = html;
	return el.firstChild;
};

TileSet.prototype.private.build = function ( x ) {
	var tmpl = x.private.templates.tileset(), p;
	tmpl = x.private.replaceAll( tmpl, '{{height}}', x.height );
	tmpl = x.private.replaceAll( tmpl, '{{id}}', x.id );
	tmpl = x.private.replaceAll( tmpl, '{{width}}', x.width );
	tmpl = x.private.replaceAll( tmpl, '{{startHeight}}', x.startHeight );
	tmpl = x.private.replaceAll( tmpl, '{{startWidth}}', x.startWidth );
	tmpl = x.private.replaceAll( tmpl, '{{display}}', x.display || 'show' );
	x.parent = p = document.querySelector( x.parent );
	p.appendChild( x.private.convertToElement( tmpl ) );
	x.el = p.querySelector('#'+x.id );
	if (x.display !== 'show' && x.display !== 'true') {
		x.parent.style.display='none';
	}
};

TileSet.prototype.private.replaceAll = function ( str, find , replace ) {
  var re = new RegExp(find, 'g');
	return str.replace(re, replace);
};

TileSet.prototype.private.uniqueName = function ( x ) {
	var tmp = 'tileset-';
	if ( ! x.id )  {
		x.id = Math.floor( Math.random() * 10000 );
	}
	tmp += x.id.toString().toLowerCase().replace(/\s+/g, '');
	return tmp;
};


window.TileSet = TileSet;

} ) ();

// requires prototypes.js base.js
/*global jQuery */
/*global ept */


/*********************************************** */
/* DEPRECATED CODE NEED TO REMOVE
/*********************************************** */

( function( $, window, document, ept ){

  'use strict';

 /**
 * URL properties
 * @namespace ept.tile
 */
  ept.tile ={};

/**
* Updates an existing Tile on the page
* @function update
* @memberof ept.tile
* @param {object} tile JSON Object represeting the tile
*/
  ept.tile.update = function ( data ) {
    var tile, tiles, tmp, tileset, tileface;
    tiles = $.parseJSON( data );
    tiles = tiles.tiles;

    tiles.forEach( function( currentTile ) {

    if ( currentTile.id ) {
      tile = $( '#' + currentTile.id );
      tileset = tile.parents('.macys-tile-container');
    } else {
      tileset = $( '[data-tileset=' + tile.tileset + ']' );
      tile = tileset.find( '[data-location=' + tile.location + ']' );
    }
    tileface = tile.find('a');

    if ( tile.length ) { tile = tile[0]; }

    if ( currentTile.color ) {
      ept.log('- Changing color to '+  currentTile.color);
      tile.className = updateClasses('macys-tile-color', tile.className, 'macys-tile-color-' + currentTile.color );
    }
    if (currentTile.icon ) {
      ept.log('- Changing icon to '+ currentTile.icon);
      tmp = tile.find('.macys-tile-icon');
      tmp[0].className = updateClasses('macys-tile-icon-', tmp[0].className, 'macys-tile-icon-' +currentTile.icon );
    }
    if (currentTile.title ) {
      ept.log('- Changing title to '+ currentTile.title);
      tile.find('.macys-title-header').html(currentTile.title );
    }
    if (currentTile.comments ) {
      ept.log('- Changing comments to '+ currentTile.comments);
      tile.find('.macys-title-desc').html(currentTile.comments );
      tile.find('a').removeClass('macys-tile-no-desc').addClass('macys-tile-desc');
    }
    if (currentTile.comments ==='<div></div>' ||currentTile.comments === '' ) {
      tile.find('.macys-title-desc').html( '' );
      tile.find('a').removeClass('macys-tile-desc').addClass('macys-tile-no-desc');
    }
    if (currentTile.description ==='' ||currentTile.description === '' ) {
      tile.find('.macys-title-desc').html( '' );
      tile.find('a').removeClass('macys-tile-desc').addClass('macys-tile-no-desc');
    }
    if (currentTile.badge ) {
      ept.log('- Adding icontext : '+ currentTile.text);
      tile.find('.macys-tile-icon-badge').html( currentTile.badge ).attr( 'data-badge', currentTile.badge );
  //    tile.find('.macys-tile-icon-text').html(currentTile.badge );
    }
    if (currentTile.url ) {
      ept.log('- Changing url to '+ currentTile.url);
      tile.find('a').attr('href',currentTile.url);
    }
    if (currentTile.target ) {
      ept.log('- Changing target to '+ currentTile.target);
      tile.find('a').attr('target',currentTile.target);
    }
    if (currentTile.size ) {
      ept.log('- Changing size to '+ currentTile.size);
      tile.className = updateClasses('macys-tile-size', tile.className, 'macys-tile-size-' +currentTile.size );
    }
    if (currentTile.moveTo ) {
      ept.log('- Moving Tile to '+ currentTile.moveTo);
      var col=currentTile.moveTo.toString().charAt(0),
            row=currentTile.moveTo.toString().replace(col,'');
      tile.className = updateClasses('macys-tile-col', tile.className, 'macys-tile-col' + col );
      tile.className = updateClasses('macys-tile-row', tile.className, 'macys-tile-row' + row );
      tile.attr('data-location',currentTile.moveTo);
    }
    if (currentTile.html) {
      ept.log('- Replacing Tile HTML ');
      tmp =currentTile.html.replaceAll('|','"');
      tileface.html(tmp);
    }

    tile.trigger('tilesupdated');
    });
  };

function updateClasses (partial, classes, addclass) {
  var len = 0,i=0, current, updated='';
  classes=classes.split(' ');
  len = classes.length;
  for(;i<len;i++) {
    current=classes[i];
    if (! current.has(partial)) {
      updated+=' ' +current;
    }
  }
  updated+=' '+addclass;
  return updated.trim();
}

/**
* Updates an existing Tile on the page
* @function updateTile
* @memberof ept
* @deprecated [See ept.tile.update]
* @param {object} tile JSON Object represeting the tile
*/
  ept.updateTile = function ( data ) {
    var tile, tiles, i, tmp, tileset, tileface;
    tiles = $.parseJSON( data );
    tiles=tiles.tiles;

    for( i=0; i < tiles.length;i++ ) {
      tileset = $( '[data-tileset=' + tiles[i].tileset + ']' );
      tile = tileset.find( '[data-location=' + tiles[i].location + ']');
      tileface = tile.find('a');

      ept.log('Modifying Tile at '+tiles[i].location+'...');
      if ( tiles[i].color ) {
        ept.log('- Changing color to '+  tiles[i].color);
        tile[0].className = updateClasses('macys-linktile-color', tile[0].className, 'macys-linktile-color-' + tiles[i].color );
      }
      if ( tiles[i].icon ) {
        ept.log('- Changing icon to '+  tiles[i].icon);
        tmp=tile.find('.macys-linktile-icon');
        tmp[0].className = updateClasses('mymacys-icon-', tmp[0].className, 'mymacys-icon-' + tiles[i].icon );
      }
      if ( tiles[i].title ) {
        ept.log('- Changing title to '+  tiles[i].title);
        tile.find('.macys-title-header').html( tiles[i].title );
      }
      if ( tiles[i].comments ) {
        ept.log('- Changing comments to '+  tiles[i].comments);
        tile.find('.macys-title-desc').html( tiles[i].comments );
        tile.find('a').removeClass('macys-tile-no-desc').addClass('macys-tile-desc');
      }
      if ( tiles[i].comments ==='<div></div>' || tiles[i].comments === '' ) {
        tile.find('.macys-title-desc').html( '' );
        tile.find('a').removeClass('macys-tile-desc').addClass('macys-tile-no-desc');
      }
      if ( tiles[i].text ) {
        ept.log('- Adding icontext : '+  tiles[i].text);
        tile.find('.macys-listtile-icon-text').html( tiles[i].text );
      }
      if ( tiles[i].url ) {
        ept.log('- Changing url to '+  tiles[i].url);
        tile.find('a').attr('href', tiles[i].url);
      }
      if ( tiles[i].target ) {
        ept.log('- Changing target to '+  tiles[i].target);
        tile.find('a').attr('target', tiles[i].target);
      }
      if ( tiles[i].size ) {
        ept.log('- Changing size to '+  tiles[i].size);
        tile[0].className = updateClasses('macys-listtile-size', tile[0].className, 'macys-listtile-size-' + tiles[i].size );
      }
      if ( tiles[i].moveTo ) {
        ept.log('- Moving Tile to '+  tiles[i].moveTo);
        var col=tiles[i].moveTo.toString().charAt(0),
            row=tiles[i].moveTo.toString().replace(col,'');
        tile[0].className = updateClasses('macys-tile-col', tile[0].className, 'macys-tile-col' + col );
        tile[0].className = updateClasses('macys-tile-row', tile[0].className, 'macys-tile-row' + row );
        tile.attr('data-location', tiles[i].moveTo);
      }
      if (tiles[i].html) {
        ept.log('- Replacing Tile HTML ');
        tmp = tiles[i].html.replaceAll('|','"');
        tileface.html(tmp);
      }

      tile.trigger('tilesupdated');
    }

  };

})(jQuery, window, document, ept);

// requires base.js

/*global jQuery */
/*global ept */

( function( $, window, document, ept ){

  'use strict';
/**
 * URL properties
 * @namespace ept.url
 */
  ept.url ={
/**
* Returns the hostname from the URL
* @property {string} host The hostname from the URL
* @memberof ept.url
*/
        host : window.location.host,
/**
* Returns the hostname from the URL
* @property {string} host The hostname from the URL
* @memberof ept.url
*/
        hostname : window.location.hostname,
/**
* Returns the hash from the URL
* @property {string} hash The hash from the URL
* @memberof ept.url
*/
        hash : window.location.hash,
/**
* Returns the full URL
* @property {string} href The full URL
* @memberof ept.url
*/
        href : window.location.href,
/**
* Returns the origin from the URL
* @property {string} origin The origin from the URL
* @memberof ept.url
*/
        origin : window.location.origin,
/**
* Returns the pathname from the URL
* @property {string} pathname The pathname from the URL
* @memberof ept.url
*/
        path : window.location.pathname,
/**
* Returns the port from the URL
* @property {string} port The port from the URL
* @memberof ept.url
*/
        port : window.location.port,
/**
* Returns the protocol from the URL
* @property {string} protocol The protocol from the URL
* @memberof ept.url
*/
        protocol : window.location.protocol,
/**
* Returns the search (paramters) from the URL
* @property {string} search The search (parameters) from the URL
* @memberof ept.url
*/
        query : window.location.search,
/**
* Returns Sharepoints fullpath from the URL
* @property {string} fullpath Sharepoints fullpath from the URL
* @memberof ept.url
*/
        fullpath : null,  //populated after onload via Sharepoint
  };

/**
* Parses a given url into component parts matching location object
* @property {string} fullpath Sharepoints fullpath from the URL
* @memberof ept.url
*/

  ept.url.parse = function(url) {
    if (!url) return;
    var a = document.createElement('a');
    a.href = url;
    var qs = readQSValues(a.search);
    return {
        host: a.host,
        hostname: a.hostname,
        hash: a.hash.replace('#', ''),
        href: a.href,
        path: a.pathname.replace(/^([^/])/, '/$1'),
        protocol: a.protocol.replace(':', ''),
        query: a.search,
        qs: qs,
    };
  };

 function readQSValues(url) {
    if (url.length < 1) { return []; }

    var aCouples = url.substr(1).split('&'),
        aItKey = [], name = '',
        len = aCouples.length;
    var qs = {};

    while (len--) {
        aItKey = aCouples[len].toString().toLowerCase().split('=');
        name = decodeURI(aItKey[0]) + '';
        qs[name] = (aItKey.length > 1) ? decodeURI(aItKey[1]) : '';
    }
    return qs;
}


/**
* Contains all of the querystring parameters as individual properties from the URL
* @property {string} qs Sharepoints fullpath from the URL
* @memberof ept.url
*/
  ept.url.qs = {}; //populated below

  if ( window.location.search.length > 1 ) {
    for ( var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split('&'); nKeyId < aCouples.length; nKeyId++) {
      aItKey = aCouples[nKeyId].toString().toLowerCase().split('=');
      ept.url.qs[ decodeURI( aItKey[0] ) ] = aItKey.length > 1 ? decodeURI( aItKey[1] ) : '';
    }
  }

  if (ept.url.qs.eptdebug) { ept.debug = ept.url.qs.eptdebug; }

})( jQuery, window, document, ept );

// requires prototypes.js base.js async.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ){

'use strict';

  function formatUserData( data ) {
    var user, temp, len, i;
    if (data.d) {
      user = data.d;
      temp = data.d.UserProfileProperties.results;
      len = temp.length;

      for( i = len; i--; ) {
        var key = temp[i].Key.toString(), val = temp[i].Value;
        key = key.replace( 'SPS-', 'sps' ).replace( 'fds-', 'fds' ).replace( 'Zl', 'zl' );
        if ( key.toString().indexOf( 'FirstName LastName PreferredName fdsNickName ') > -1 ) { key = val.toString().toProperCase(); }
        user[key] = val;
      }
      user.Picture = '/_layouts/15/userphoto.aspx?size=S&accountname='+user.Email;
      return user;
    } else {
      return false;
    }
  }

  function getUserProperties( id ) { //Pass id
    id = id || '';
    id = id.toString();
    var myurl = ( id ) ? "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='Federated\\" + id + "'" : '/_api/SP.UserProfiles.PeopleManager/GetMyProperties';
    return ept.ajax( { url : myurl } );
  }


  function getCurrentUser() {
      var dfd = $.Deferred( function( dfd ) {
        $.when( getUserProperties() ).done( function ajaxUserData( data ) {
            var results = formatUserData( data );
            ept.user = results;
            dfd.resolve( results );
            $(document).trigger('userDataLoaded');
        }).fail( function ajaxUserDataFailed( data ) {
            dfd.reject( data );
        });
      });
      return dfd;
  }

  function getUser( id ) {
    var dfd = $.Deferred( function( dfd ) {
      $.when( getUserProperties( id )  ).done( function ajaxUserDataByID( data ) {
        if ( data.d.AccountName ) {
          dfd.resolve( formatUserData( data ) );
          $(document).trigger('userDataLoaded');
        } else {
          dfd.reject( data );
        }
      }).fail( function ajaxUserDataByIDFailed( data ) {
        dfd.reject( data );
      });
    });
    return dfd;
  }


/**
* Get a URL to the the current users picture
* @function getUserPicUrl
* @memberof ept
* @returns {string} URL to the the current users picture
*/
  ept.getUserPicUrl = function() {
    return '/_layouts/15/userphoto.aspx?size=M&accountname=' +ept.user.Email;
  };

/**
* Reads the current users Employee ID from the page
* @function getEmployeeID
* @memberof ept
* @returns {string} The Employee ID of the current user
*/
  ept.getEmployeeID = function () {
    return $( 'meta[name=Employeeid]' ).attr( 'content' )+'' || '';
  };

/**
* Reads the current users Business Unit(s) from the page
* @function getNavFOB
* @memberof ept
* @returns {string} Comma delimited string of the Business Units the user belongs to
*/
  ept.getNavFOB = function () {
    return $( 'meta[name=NavFOB]' ).attr( 'content' ) + '' || '';
  };

  ept.fixUserID = function ( id ) {
    id = id.replace( 'federated', '' );
    id = 'B' + id;
    id = id.replace( 'Bb', 'b' );
    return id;
  };

/**
* Read the given users profile data
* @function getUser
* @memberof ept
* @param {string} [id] = Optional. The User ID. If blank, retunrs the current user
* @returns {object} A jQuery Promise
*/
  ept.getUser = function ( id ) {
    return (id) ? getUser( id ) : getCurrentUser();
  };

  //if we arent in the macys partners domain, load the user profile
  if (location.hostname.indexOf('macyspartners')===-1) {
    ept.getUser();
  }

})( jQuery, window, document, ept );
