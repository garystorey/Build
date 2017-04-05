//requires base.js
/*global jQuery */
/*global ept */
/*global mp */

( function( $, window, document, ept, mp ){
  'use strict';

  mp.menu = {};

  mp.classes.menu = {
    selectednav : 'is-selected',
    all : 'macys-menu',
    primary : 'macys-header-nav-area',
  };

  mp.menu.tiles = {};

  mp.menu.selected = null;
  mp.menu.allmenus = null;
  mp.menu.primary = null;


  mp.menu.open = function ( menu ) {
    ept.log('mp.menu.open');
    var area = $( '#' + menu.data('show') ),
        page = menu.data('load'),
        cached = ept.isTrue( menu.data('cache') ),
    /* using attr vs data method so the DOM will reflect that the page loaded */
        isLoaded = ept.isTrue( menu.attr( 'data-loaded' ) );

    location.href = '#s4-bodyContainer';
    mp.menu.current( menu );
    area.show();
    if (!ept.isTrue( isLoaded ) && page) {
      mp.menu.load( area,  page, cached );
    }
    return this;
  };

  mp.menu.close = function ( ) {
    ept.log('mp.menu.close');
    mp.menu.selected = null;
    mp.menu.allmenus.hide();
    $('.' + mp.classes.menu.selectednav ).removeClass( mp.classes.menu.selectednav );
  };

  mp.menu.toggle = function ( menu ) {
    ept.log('mp.menu.toggle');
    if ( !mp.menu.compare( menu, mp.menu.selected )) {
      mp.menu.close();
      mp.menu.open( menu );
    } else {
      mp.menu.close();
      mp.menu.selected = null;
    }
  };

  mp.menu.current = function ( menu ) {
    ept.log('mp.menu.current');
    if ( !menu ) { return mp.menu.selected; }
    mp.menu.selected = menu;
    $('.' + mp.classes.menu.selectednav ).removeClass( mp.classes.menu.selectednav );
    menu.addClass( mp.classes.menu.selectednav );
    return menu;
  };

  mp.menu.compare = function ( menu1, menu2 ) {
    ept.log('mp.menu.compare');
    if ( !menu2 || !menu1 ) { return false; }
    return ( menu1[0] === menu2[0] );
  };

  mp.menu.keycheck = function ( ev ) {
    ept.log('mp.menu.keycheck');
    if ( ept.compareKey( ev, ept.keys.ESCAPE ) ) { mp.menu.close(); }
  };

  mp.menu.load = function( area, page, cached ) {
    ept.log('mp.menu.load');
    var dlg = ept.isTrue( ept.url.qs.isdlg ), // is this a SP dialog?
        caching = ept.isTrue( mp.settings.cache ), // are we caching pages?
        id =  area.attr('id'), // get area's ID
        url = '//' + ept.url.hostname +  page + ' #macys-navigation-cnt';

    var content = !dlg && !cached && caching && ept.retrieve( id );
    if ( ept.isTrue( content ) ) {
      area.html( content ).trigger('menuPageLoaded', {id : id, page: page, area : area[0] });
      return;
    }

    area.load( url, function loadContentComplete( a , s, b ) {
      a=b;
      if (s.toLowerCase() === 'error') {
        area.html( '<h1>Failed to load content</h1>' + mp.addCloseButton() );
      } else {
        area.append( mp.addCloseButton() ).trigger('menuPageLoaded', {id : id, page: page, area : area[0] });
        if ( cached ) { ept.store( id, area.html(), 'session' ); }
      }
    });
    return;
  };

  mp.menu.events = function(){
    ept.log('mp.menu.events');
    $('body').on( 'keyup.mp', function checkForEscKey( ev ) {
      mp.menu.keycheck( ev );
    });

    mp.menu.primary.on( 'click.mp', function openNavMenu() {
      mp.menu.toggle( $(this) );
    });

    mp.menu.bu.on('click.mp', function openBuNav(){
      mp.menu.toggle( $(this) );
      mp.mdd.open();
    });

    $(document).on('menuPageLoaded', function menuPageLoadedEvent(event,data){
        mp.tiles.check(event,data);
    });

  };

  mp.menu.init = function() {
    ept.log('mp.menu.init');
    mp.menu.allmenus = $('.' + mp.classes.menu.all );
    mp.menu.primary = $('.' + mp.classes.menu.primary ).not('#nav-businessunits');
    mp.menu.bu = $('#nav-businessunits');
    mp.menu.events();
  };

  ept.onLoad('mp.menu.init');

})( jQuery, window, document, ept, mp );
