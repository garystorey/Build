//requires base.js
/*global jQuery */
/*global ept */
/*global mp */
( function( $, window, document, ept, mp ){
  'use strict';

  mp.plugins = {};

  mp.plugins.init = function() {
    ept.log('mp.plugins.init');
    if ( !mp.isEditMode() ) {
      mp.plugins.tabs();
    }
  };

  mp.plugins.tabs = function() {
    ept.log('mp.plugins.tabs');
    var tabs = $('.macys-tab-webpart');
    if ( tabs.length ) {
      $.getScript('/_layouts/15/MyMacys/scripts/ept.tabs.min.js', function loadTabScript() {
        tabs.macysTabs();
      });
    }
  };

  ept.onLoad('mp.plugins.init');

}(jQuery, window, document, ept, mp));
