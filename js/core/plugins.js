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
