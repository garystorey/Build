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
