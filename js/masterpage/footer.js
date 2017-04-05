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

