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
