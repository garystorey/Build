/*global jQuery */
/*global ept */

( function( $, window, document, ept ){

  'use strict';

  var mp = {};

  mp.settings = {
    debug : false,
    cache :  true,
    quicklinkUrl : '/mylinks/_layouts/15/MyQuickLinks.aspx?isDlg=1',
    closebutton : '<div class="macys-button {{closebuttonclass}}"><span class="macys-button-text"></span></div>',
    defaultPicture : '/_layouts/15/images/o14_person_placeholder_32.png',
    favUrl : '//mysites.mymacys.net/addfavorites.aspx?isDlg=1&source99={{loc}}&title99={{title}}',
    favWindow : 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes'
  };

  mp.classes = {
    close : 'macys-button-close',
  };

  mp.init = function() {
    //if QS is set to nocache update cache setting
    if ( ept.isTrue( ept.url.qs.nocache ) )  { mp.settings.cache = false; }
    mp.events();
    mp.picture.load();
  };

  mp.addCloseButton = function() {
    return mp.settings.closebutton.replace('{{closebuttonclass}}', mp.classes.close );
  };


  mp.events = function() {
    $('#s4-bodyContainer').on( 'click.mp', '.' + mp.classes.close , function closeButton() { mp.menu.close(); });
    $('.macys-header-user').on('click.mp', function(e) {
      var menu = (location.href.indexOf('/_layout')>-1) ? 'zz6_Menu' : 'zz7_Menu';
      /* the line below throws a 'new' prefix error because of the capitalization of MS functon names */
      /*eslint-disable no-undef*/
      CoreInvoke( 'MMU_Open', byid('zz2_ID_PersonalActionMenu'), MMU_GetMenuFromClientId(menu),e,true, null, 0);
      /*eslint-enable no-undef*/
      return false;
    });
    $('#macys-onedrive').on('click', function(){ window.open('http://mysites.mymacys.net/personal/'+ept.user.UserName+'/Documents/Forms/All.aspx');  });
    $('#macys-o365').on('click', function(){ window.open('https://portal.office.com/Home'); });
    $('#macys-yammer').on('click', function(){ window.open('https://www.yammer.com/office365'); });
    $('#macys-osites').on('click', function(){ window.open(' http://mysites.mymacys.net/Person.aspx'); });

    $(document).on('click','#macys-addfav', function(e){
      e.preventDefault();
      var loc = location.href.replace('#s4-bodyContainer','');
      window.open( '//mysites.mymacys.net/addfavorites.aspx?isDlg=1&source99=' + loc + '&title99=' + document.title ,'AddFav', 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,width=350,height=350');
      return false;
    });

  };

  mp.isEditMode = function() {
    return !( typeof macysEditMode === "undefined" ||  $('#MSOLayout_InDesignMode').val() === '' );
  };

  mp.picture = {};

    mp.picture.load = function() {
      var pic = ept.retrieve( 'pictureUrl');
      if ( !pic ) {
        pic = ept.getUserPicUrl();
        ept.store( 'pictureUrl', pic, 'session' );
      }
      var $menu = $('#welcomeMenuBox').find('a[title="Open Menu"]');
      var txt=$menu.text().replace('Use SHIFT+ENTER to open the menu (new window).','');
      $menu.html('<img src="'+pic+'" height="39" width="39"/>').attr('title',txt);
    };

  window.mp = mp;

  ept.onload('mp.init');

}(jQuery, window, document, ept));

//requires base.js
/*global jQuery */
/*global ept */
/*global mp */

( function( $, window, document,ept, mp ){
'use strict';

  mp.footer = {};

  mp.settings.footer = {
      link : '<span class="macys-footer-item"><a href="{{url}}" target="{{target}}"">{{title}}</a></span>',
      seperator : '<span class="macys-footer-separator"></span>'
  };

  mp.footer.init = function() {
    ept.log('mp.footer.init');
    var mfooter = $('#MacysFooter');

    if ( mfooter.length ) {
      var footer = ept.retrieve('mmfooter');
      if ( footer ) {
        mfooter.html( footer );
        return;
      }

      footer='';
      $.when ( ept.getSPList('/','MacysFooter','$orderby=Sortorder asc')).done( function loadFooter(results) {
        var data=results.d.results, i=0, len=data.length, curr;
        for (; i < len; i++ ) {
          curr = data[i];
          if ( ept.isTrue( curr.Active ) ) {
            footer += mp.settings.footer.link;
            footer += ( i < ( len - 1 ) ) ? mp.settings.footer.seperator : '';

            footer = footer.replaceAll( '{{url}}', curr.URL.Url ). replaceAll( '{{title}}', curr.URL.Description );
            footer = ( ept.isTrue( curr.OpenInNewWindow )) ? footer.replaceAll( '{{target}}', '_blank' ) : footer.replaceAll( '{{target}}', '' );
            ept.store( 'mmfooter', footer, 'session' );
            mfooter.html( footer );
          }
        }
      });
    }
  };

  ept.onLoad('mp.footer.init');

}(jQuery, window, document, ept, mp));


//requires base.js
/*global jQuery */
/*global ept */

/*
(function($){
	'use strict';
	var leftnav = $('#zz15_RootAspMenu');
	if (leftnav.length) {
		leftnav.find('li ul').hide().parent('li').addClass('leftnav-parent-li');
		leftnav.find('.leftnav-parent-li').on('click', function(evt){
			evt.preventDefault();
			var $t = $(evt.target)
			var $c  = $t.children('a');
			if ($c.length) { location.href= $c.href;}
			$t.toggleClass('leftnav-open').find('ul').toggle();
		});
	}

})( jQuery );
 */

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

//requires base.js
/*global ept */

(function (ept) {

    'use strict';
    var tiles = {};

    var tilesArray = [];

    /* Helper functions */
    /***************************************/
    /***************************************/


    var attr = function (el, attribute) {
        return el.getAttribute('data-' + attribute);
    };

    var getTileSetObject = function () {
        return {
            tiles: [],
            height: 1,
            width: 2,
            display: 'hide',
            parent: '',
            set: ''
        };
    };

    var hasDescription = function (size, title) {
        title = title.trim();
        return ((size !== '1x1' || size !== '2x1' || size !== '1x2') && title) ? 'macys-tile-desc' : 'macys-tile-no-desc';
    };

    var hideTileSets = function () {
        var hiddenTileSets = document.querySelectorAll('.macys-tile-container');
        ept.forEach(hiddenTileSets, function (el) {
            if (!el.classList.contains('macys-tile-show')) {
                if (!el.classList.contains('macys-tile-hide')) {
                    //should have one or the other so it has been "shown" on the screen
                    //console.log(el.id);
                    el.classList.add('macys-tile-hide');
                    el.parentNode.setAttribute('style', '');
                }
            }
        });
    };

    var hideOverlay = function () {
        var overlay = document.querySelector('.macys-tile-overlay');
        var showing = overlay.getAttribute('data-show') + ''.toLowerCase();

        overlay.style.display = 'none';
        overlay.setAttribute('data-opener', '');
        overlay.setAttribute('data-showing', '');
        showing = document.getElementById(showing);
        showing.setAttribute('style', '');
        showing.style.display = 'none';
        showing.querySelector('.macys-tile-container').classList.add('macys-tile-hide');
    };

    var appendOverlay = function () {
        var overlay = document.querySelector('.macys-tile-overlay');
        if (!overlay) {
            overlay = ept.createElement({
                tag: 'div',
                text: '',
                id: '',
                classes: ['macys-tile-overlay']
            });
        }
        document.body.appendChild(overlay);
        overlay.addEventListener('click', hideOverlay);
        return overlay;
    };

    var getTileObject = function () {
        return {
            title: '',
            id: '',
            set: '',
            badge: '',
            type: 'standard',
            url: '#',
            icon: 'None',
            color: 'Red',
            size: '1x1',
            row: 'A',
            column: '1',
            target: '',
            description: '',
            tiledescription: '',
            hasDescription: 'macys-tile-no-desc',
            isGroupTile: false
        };
    };

    var parseUrl = function (url) {
        ept.log('fn:parseUrl');
        var settings = {};
        var tmp = url.split('?');
        url = tmp[1];
        if (url) {
            var aCouples = url.split('&');
            //we need to get qs values
            if (aCouples.length) {
                for (var aItKey, nKeyId = 0; nKeyId < aCouples.length; nKeyId++) {
                    aItKey = aCouples[nKeyId].toString().toLowerCase().split('=');
                    settings[decodeURI(aItKey[0])] = aItKey.length > 1 ? decodeURI(aItKey[1]) : '';
                }
            }
        }
        //make sure we have required values
        if (!settings.set) {
            settings.set = '1';
        } else {
            settings.set = settings.set.trim();
        }
        if (!settings.startLocation) {
            settings.startLocation = 'A1';
        } else {
            settings.startLocation = settings.startLocation.trim();
        }
        if (!settings.height) {
            settings.height = '1';
        } else {
            settings.height = settings.height.trim();
        }
        if (!settings.width) {
            settings.width = '2';
        } else {
            settings.width = settings.width.trim();
        }
        return settings;
    };

    var processLI = function (li, i, setObj) {
        var a = li.querySelector('a');
        var size = attr(li, 'size') + '';
        var title = a.innerHTML;
        var type = attr(li, 'type') + '';
        var current = getTileObject();
        var desc = a.getAttribute('title');
        desc = (desc) ? desc + '' : '';

        ept.log('i:' + i);

        type = type.toLowerCase();

        current.title = title.trim();
        current.id = setObj.set + '-' + (i + 1);
        current.set = setObj.set + '';
        current.badge = attr(li, 'badge') + '';
        current.icon = attr(li, 'icon') + '';
        current.color = attr(li, 'color') + '';
        current.size = size;
        current.row = attr(li, 'row') + '';
        current.column = attr(li, 'column') + '';
        current.description = desc;
        current.tiledescription = a.getAttribute('title');
        current.hasDescription = hasDescription(size, desc);
        current.target = a.getAttribute('target') + '';
        current.type = type;

        if (type === 'standard') {
            current.isGroupTile = false;
            current.url = a.getAttribute('href');
        }

        if (type === 'group') {
            var setInfo = parseUrl(a.getAttribute('href'));
            var url = "javascript:tiles.open('{{set}}','" + current.set + "');";
            current.isGroupTile = true;
            current.url = url.replace('{{set}}', ept.removeSpecialChars(ept.removeSpaces(setInfo.set)));
        }

        if (type === 'weather' || type === 'stocks') {
            current.isGroupTile = false;
            current.url = '#';
            ajax('http://mymacys.net/Pages/stockandweatherdata.aspx?type=' + type, processData);
        }
        return current;
    };

    var processData = function (data) {
        ept.log(data);
    };

    var processSet = function (set, i) {
        var setName = attr(set, 'tileset');
        var allLIs = set.querySelectorAll('li');
        var tilesetObject = getTileSetObject();

        ept.log('i:' + i);

        tilesetObject.parent = '#tileset-holder-' + setName;
        tilesetObject.display = attr(set, 'display') + '';
        tilesetObject.set = setName;
        tilesetObject.height = attr(set, 'tile-height') + '';
        tilesetObject.width = attr(set, 'tile-width') + '';

        ept.forEach(allLIs, function (li, i) {
            tilesArray.push(processLI(li, i, tilesetObject));
        });

        tilesetObject.tiles = tilesArray;
        tiles.createSet(tilesetObject);
        tilesArray.length = 0;
    };

    var getHeight = function (el) {
        var a = [el.scrollHeight, el.clientHeight, el.offsetHeight].sort();
        return a[0] + 10;
    };
    var getWidth = function (el) {
        var a = [el.scrollWidth, el.clientWidth, el.offsetWidth].sort();
        return a[0] + 10;
    };

    var centerTileSet = function (el) {
        ept.log('fn:centerTileSet');
        var top = Math.max(0, ((window.innerHeight - getHeight(el)) / 2));
        var left = Math.max(0, ((window.innerWidth - getWidth(el)) / 2));
        if (top > 250) {
            top = 250;
        }
        el.style.top = top + 'px';
        el.style.left = left + 'px';
    }

    var createCORSRequest = function (url, method) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    };

    var ajax = function (url, callback, method) {
        method = method || 'GET';
        var xhr = createCORSRequest(url, method);
        if (!xhr) {
            ept.log('CORS not supported');
            return;
        }
        xhr.onload = function () {
            callback(xhr.reponseText);
        };

        xhr.onerror = function () {
            ept.log('Woops, there was an error making the request.');
        };

        xhr.send();
    };

    /***************************************/
    /***************************************/

    tiles.check = function (event, data) {
        var area, tilesets, el;
        ept.log('mp.menu.tiles.check');
        ept.log('event: ' + event); //we dont need it but since we defined it....

        //Only returns true if we are in Edit Mode in SP
        if (ept.isEditMode()) {
            return;
        }
        area = (data) ? document.getElementById(data.id) : document.body;
        tilesets = area.querySelectorAll('ul[data-tileset]');
        ept.forEach(tilesets, function (set, i) {
            el = ept.createElement({
                tag: 'div',
                id: 'tileset-holder-' + attr(set, 'tileset'),
                text: ''
            });
            tilesets[i].parentNode.appendChild(el);
            processSet(set, i);
            set.parentNode.removeChild(set);
        });
    };

    tiles.createSet = function (settings) {
        ept.log('fn:mp.menu.tiles.createSet');
        var tsid;
        /* eslint-disable no-undef */
        var ts = new TileSet();
        /* eslint-enable no-undef */
        ts.parent = settings.parent;
        ts.height = settings.height;
        ts.width = settings.width;
        ts.display = settings.display;
        ts.startAt = 'A1';
        ts.init();
        ts.add(settings.tiles);
        tsid = ts.getId();
        ts = null;
        return tsid;
    };

    tiles.open = function (setToShow, currentSet) {
        var parent = document.getElementById('tileset-holder-' + setToShow);
        var el = parent.querySelector('.macys-tile-container');
        var overlay = appendOverlay();
        hideTileSets();
        overlay.setAttribute('data-opener', 'tileset-holder-' + currentSet);
        overlay.setAttribute('data-show', 'tileset-holder-' + setToShow);
        overlay.style.display = 'block';
        overlay.style.transform = 'scale(1)';
        parent.style.backgroundColor = '#fff';
        parent.style.position = 'absolute';
        parent.style.display = 'block';
        parent.style.zIndex = 1000001;
        parent.style.padding = '10px';
        centerTileSet(parent);
        el.classList.remove('macys-tile-hide');
    };

    window.tiles = tiles;

    ept.onLoad('tiles.check');

})(ept);
