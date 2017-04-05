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
