//requires base.js menu.js
/*global jQuery */
/*global ept */
/*global mp */
( function( $, window, document, ept, mp ){
  'use strict';

  mp.mdd = {};

  mp.mdd.nav = null;

  mp.settings.mdd = {
    menu : '<li><div data-current="false" class="macys-accordion-header"><span></span>{{category}}</div><div class="macys-accordion-content"><ul class="macys-subnav-links">',
    menuend: '</ul></div></li>',
    menuitem : '<li><div data-cache="true" data-loaded="false" data-load="{{url}}" data-show="{{area}}" id="link-{{area}}" class="{{classes}}">{{title}}</div></li>', //classes :macys-accordion-active macys-subnav-title
    content : '<div id="{{area}}" class="macys-subnav-area"><h1><img src="/_layouts/images/loading.gif" alt="loading" width="50" height="50" />Working On It...</h1></div>',
    accordionOptions : {
      headerClass : 'macys-accordion-header',
      contentClass : 'macys-accordion-content',
      expandClass : 'macys-accordion-expanded',
      showArea : '.macys-accordion-active',
      activeClass : 'macys-accordion-active',
      oneAreaAlwaysVisible : true,
      showMultipleAreas : false
    }
  };

  mp.classes.mdd = {
    navigate : 'macys-bu',
    accordion : 'macys-nav-accordion',
    subnavlinks : 'macys-subnav-title',
    subnavareas : 'macys-subnav-area',
    accordionheaders : 'macys-accordion-header',
    subnavContent : 'macys-subnav-content',
    subnavlinkholder : 'macys-subnav-links',
  };


  mp.mdd.init = function() {
    ept.log('mp.mdd.init');
    mp.mdd.nav = $('#macys-navigation');
  };

  mp.mdd.open = function() {
    ept.log('mp.mdd.open');
    var nav = mp.mdd.nav;
    if ( ept.isTrue( nav.data('loaded') ) ) {
        mp.mdd.setup();
      } else {
        mp.mdd.load();
      }
    };

  mp.mdd.show = function( menu ) {
  ept.log('mp.mdd.show');
   var area = $( '#' + menu.data('show') ),
       page = menu.data('load'),
       cached = ept.isTrue( menu.data('cache') ),
    /* using attr vs data method so the DOM will reflect that the page loaded */
       isLoaded = ept.isTrue( menu.attr( 'data-loaded' ) );

    mp.mdd.close();
    menu.addClass( mp.settings.mdd.accordionOptions.activeClass );
    area.show();

    if (!ept.isTrue( isLoaded ) && page) {
      mp.menu.load( area,  page, cached );
    }
  };

  mp.mdd.load = function() {
    ept.log('mp.mdd.load');
    var results, filter='$orderby=Category%20asc,OrderBy%20asc';
    results = ept.retrieve('accordion-menu');
    if ( !results ) {
      results = ept.getSPList( '/', 'EnterpriseFOBNavigation', filter );
      results.done( function loadMenu( data ) {
        mp.mdd.build( data.d.results );
      });
    } else {
      mp.mdd.accordion( results, ept.retrieve('subnavContent') );
      mp.mdd.setup();
    }
    mp.mdd.nav.data('loaded', 'true');
  };

  mp.mdd.setup = function() {
    ept.log('mp.mdd.setup');
    $('.' + mp.classes.mdd.accordion ).accordion( 'show:.' + mp.settings.mdd.accordionOptions.activeClass );
  };

  mp.mdd.accordion = function ( content, areas) {
    ept.log('mp.mdd.accordion');
    $( '.'+ mp.classes.mdd.accordion ).find('>ul').append( content );
    $( '.'+ mp.classes.mdd.subnavContent ).append( areas );
    $('.' + mp.classes.mdd.accordion ).accordion( mp.settings.mdd.accordionOptions );
    $('.' + mp.classes.mdd.subnavlinkholder ).on( 'click.mp', '.' + mp.classes.mdd.subnavlinks, function accordionClick() {
      mp.mdd.show( $(this) );
    });
  };

  mp.mdd.toggle = function( ev ) {
    ept.log('mp.mdd.toggle');
    var $t = $(ev.target);
    mp.mdd.close();
    $t.addClass( mp.settings.mdd.accordionOptions.activeClass );
    mp.mdd.show( $t );
  };

  mp.mdd.current = function() {
    mp.menu.allmenus.find('.' + mp.classes.selectedarrows ).removeClass( mp.classes.selectedarrows );
    mp.menu.selected.addClass( mp.classes.selectednav ).find('.' + mp.classes.arrows ).addClass( mp.classes.selectedarrows );
  };

  mp.mdd.close = function() {
    ept.log('mp.mdd.close');
    $('.' + mp.classes.mdd.subnavareas ).hide();
    $('.' + mp.classes.mdd.subnavlinks ).removeClass( mp.settings.mdd.accordionOptions.activeClass );
  };

  mp.mdd.build = function ( data ) {
    ept.log('mp.mdd.build');
    var header = mp.settings.mdd.menu,
        menuitem = mp.settings.mdd.menuitem,
        footer = mp.settings.mdd.menuend,
        contentArea = mp.settings.mdd.content,
        currentCategory = '', i = 0, len = data.length, content = '', classes = '', areas = '', first = true,
        fob = ept.getNavFOB().toString().toLowerCase();
      for (; i < len; i++ ) {
        var row = data[i], isDefaultNav = false,
        current = row.Category.toString().toLowerCase();

        if ( ! ept.strictEqual( currentCategory, row.Category ) ) {
          content += footer + mp.mdd.replace( header, row );
          currentCategory = row.Category;
        }

        if ( fob.has( ',' + current + ',' ) ) {
        //if ( fob.has( current ) ) {
          isDefaultNav = true;
          if ( first && fob.startsWith( ',' + current + ',' ) ) {
            classes = 'macys-subnav-title macys-subnav-default ' + mp.settings.mdd.accordionOptions.activeClass ;
            first = false;
          } else {
            classes = 'macys-subnav-title';
          }
        } else {
          classes = 'macys-subnav-title';
          isDefaultNav = false;
        }

        row.Category = row.Category.replace( ' ', '__' );
        areas += mp.mdd.replace( contentArea, row );
        content += mp.mdd.replace( menuitem, row );
        content = content.replaceAll( '{{classes}}', classes ).replaceAll('{{ismynav}}', isDefaultNav );
        row.Category = row.Category.replace('__',' ');
      }

      content = content + footer;

      ept.store('accordion-menu', content, 'session');
      ept.store('subnavContent', areas, 'session');

      mp.mdd.accordion( content, areas );
      mp.mdd.setup();
  };

  mp.mdd.replace = function ( item, row ) {
    ept.log('mp.mdd.replace');
    var title = row.Title.toString().trim(),
        category = row.Category.toString().trim(),
        url = row.URL.toString().trim(),
        area = category + '_' + title;
        area = area.replaceAll(' ','').replace(/[^\w\s]/gi, ''); //removes spaces and all special characters
    return item.replaceAll('{{category}}', category).replaceAll('{{title}}', title).replaceAll('{{area}}', area).replaceAll('{{url}}', url);
  };


  ept.onLoad('mp.mdd.init');

}( jQuery, window, document, ept, mp ));
