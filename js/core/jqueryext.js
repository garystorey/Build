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
