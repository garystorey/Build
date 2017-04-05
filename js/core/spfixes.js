
/*Add function that is broken in SP2013 */
( function( $, window ) {

  'use strict';

  //ShowHidePrivacyRow('SPS_QLMICSRCHRES','1', '1SPS_QLMICSRCHRES_Link', 'Hide 5 additional links', 'Show 5 additional links');
  function ShowHidePrivacyRow( table, unknown, link, hide, show ) {
    link = $('#'+link);
    table = $('#'+table);
    unknown ='';
    var txt = link.text();
    var hidden = table.find('.groupHide');
    if (hidden.length) {
      hidden.toggleClass('groupHide').toggleClass('js-groupShow');
    } else {
      table.find('.js-groupShow').toggleClass('js-groupShow').toggleClass('groupHide');
    }
    if (txt.indexOf( 'Hide') > -1 ) {
      link.html( '<img src="/_layouts/images/downarrow.png" align="absmiddle"/>'+show );
    } else {
      link.html( '<img src="/_layouts/images/uparrow.png" align="absmiddle"/> '+hide );
    }
  }

  window.ShowHidePrivacyRow = ShowHidePrivacyRow;

})( jQuery, window );

