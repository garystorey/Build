//requires base.js
/*global jQuery */
/*global ept */
/*global mp */
( function( $, window, document, ept, mp ){

'use strict';

  mp.classes.search = {
    searchbox : 'macys-search',
    btn : 'macys-search-btn',
    scope : 'macys-search-scopes',
    input : 'macys-search-input'
  };

  mp.search = {

    url : {
      pre : '/sites/searchCenter/pages/',
      post: '?k=',
    },

    init : function() {
      ept.log('mp.search.init');
      mp.search.addEvents();
      var k = ept.url.qs.k;
      if (k) {  $('.'+mp.classes.search.input).val(unescape(k)); }
      mp.search.checkUrl();
    },

    checkUrl : function() {
      var url = ept.url.href+'';
      var parts, len;

      url=url.toLowerCase();
      if (url.indexOf('sites/searchcenter')>-1) {
        parts = url.split('?');  //remove qs
        parts = parts[0].split('#');  //remove hashes
        len = parts[0].lastIndexOf('/');
        url = parts[0].slice(len+1,parts[0].length);
        mp.search.setSelection('page',url);
      }
    },

    setSelection : function(type, value) {
      $('.'+mp.classes.search.scope).find('option').each(function( ){
        var $el = $(this);
        //var val = (type==='value') ? $el.val()+'' : $el.attr('data-page')+'';
        var val = $el.attr('data-page')+'';
        if (val.toUpperCase() === value.toUpperCase()) {
            $el.prop('selected', true);
        }
      });
    },

    addEvents : function() {
        ept.log('mp.search.addEvents');
        $( '.' + mp.classes.search.scope ).on( 'change.mp', function() {
        var $t = $(this);
        var scope = $t.find('option:selected').val();
            if ( scope=== 'All') { scope='all of the portal'; }
            $('#searchbox').attr('placeholder','Search '+scope).focus();
        });

        $( '.' + mp.classes.search.input ).on( 'keypress.mp', function(e) {
        mp.search.keycheck(e);
        });

        $( '.' + mp.classes.search.btn ).on( 'click.mp', function(e) {
        mp.search.find( e );
        });
    },

    keycheck : function ( e ) {
      ept.log('mp.search.keycheck');
      if ( ept.compareKey( e, ept.keys.ENTER ) ) {
        mp.search.find( e );
      }
    },

    find : function ( e ) {
      ept.log('mp.search.find');
      var   $t = $('.' + mp.classes.search.scope ).find(':selected'),
          url = $t.data( 'page' ),
          box = $( '.' + mp.classes.search.input ),
          val = box.val();
      e.preventDefault();
      if ( val.trim() === '' ) { box.val(''); return; }
      url = mp.search.url.pre  + url + mp.search.url.post + encodeURIComponent( val );
      ept.log(' - search URL: '+url);
      window.location = url;
    }

  };  /* end mp.search */

  ept.onLoad('mp.search.init');

}(jQuery, window, document, ept, mp));
