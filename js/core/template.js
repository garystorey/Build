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
