/*global jQuery ept window document */

( function ($, window, document, ept ) {

  'use strict';

  var apiUrl = "/_api/lists/getbytitle('{{listName}}')";

  function getSPList( obj ) {
    var itemurl = buildUrl( obj );
    return $.ajax({
      url: itemurl,
      method: 'GET',
      headers: { 'Accept': 'application/json; odata=verbose' }
    });
  }

  function createSPList( obj ) {
    var itemurl = buildUrl( obj );
    var itemdata = {
      '__metadata' : {
        'type' : getSPListType( obj.list )
      }
    };

    var data = $.extend( true, {}, itemdata , obj.data );

    return $.ajax({
        url: itemurl,
        type: 'POST',
        contentType: 'application/json;odata=verbose',
        data: JSON.stringify( data ),
        headers: {
            'Accept': 'application/json;odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val()
        }
    });
  }

  function updateSPList( obj ) {

    return $.ajax({
      url: obj.__metadata.uri,
      type: 'POST',
      contentType: 'application/json;odata=verbose',
      data: JSON.stringify( obj ),
      headers: {
          'Accept': 'application/json;odata=verbose',
          'X-RequestDigest': $('#__REQUESTDIGEST').val(),
          'X-HTTP-Method': 'MERGE',
          'If-Match': obj.__metadata.etag
      }
    });
  }

  function deleteSPList( obj ) {
    return $.ajax({
            url: obj.__metadata.uri.replace('/deleteObject()','')+'/recycle()',
            type: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'X-Http-Method': 'DELETE',
                'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                'If-Match': obj.__metadata.etag
            }
    });
  }

/*Helper Functions*/

  function getSPListType( listName ) {
    return 'SP.Data.' + listName.charAt(0).toUpperCase() + listName.split(' ').join('').slice(1) + 'ListItem';
  }

  function buildUrl( obj ) {
    var itemurl = apiUrl.replace( '{{listName}}', obj.list );
    itemurl = ( obj.site ) ? obj.site + itemurl : '';
    itemurl = replaceAll(itemurl,'//','/');
    itemurl += ( obj.options ) ? ( ( itemurl.indexOf('?') >-1 ) ? '&'+obj.options : '?'+obj.options ) : '';
    return itemurl;
  }

  function replaceAll(s, f, r) {
    while ( s.indexOf(f)>-1) {
      s=s.replace(f,r);
    }
    return s;
  }

  ept.list = {
    get: getSPList,
    add : createSPList,
    update : updateSPList,
    delete : deleteSPList
 };

})( jQuery, window, document, ept );
