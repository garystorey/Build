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
