// requires prototypes.js base.js
/*global jQuery */
/*global ept */

( function ($, window, document, ept ) {

  'use strict';

/**
 * Functions for manipulating items in a Sharepoint List
 * @namespace ept.listItem
 */

/*** See documentaion at bottom of file ***/

  var apiUrl = "/_api/lists/getbytitle('{{listName}}')/items";

  function getSPListItems( obj ) {
    var itemurl = buildUrl( obj );
    return $.ajax({
      url: itemurl,
      method: 'GET',
      headers: { 'Accept': 'application/json; odata=verbose' }
    });
  }

  function getSPListItem( obj ) {
    var itemurl = buildUrl( obj );
    itemurl += ( itemurl.indexOf('?')>-1 ) ? '&$filter=Id eq ' + obj.data.Id : '?$filter=Id eq ' + obj.data.Id;
    return $.ajax({
      url: itemurl,
      method: 'GET',
      headers: { 'Accept': 'application/json; odata=verbose' }
    });
  }

  function createSPListItem( obj ) {
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

  function updateSPListItem( obj ) {

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

  function updateItem( obj ) {
    var dfd = $.Deferred( function( dfd ) {
      $.when( getSPListItem( obj ) ).done( function getForUpdate( data ) {
        if (data.d.results.length) {
          var tmp=data.d.results[0];
          obj.data.__metadata = tmp.__metadata;
          $.when ( updateSPListItem( obj.data ) ).done( function performUpdate( data ) {
            dfd.resolve( data );
          }).fail( function performUpdateFailed() {
            dfd.reject( data );
          });
        } else {
          dfd.reject( data );
        }
      }).fail( function getForUpdateFailed( data ) {
          dfd.reject( data );
      });
    });
    return dfd;
  }


  function deleteSPListItem( obj ) {

    var url = obj.__metadata.uri;
    url = (obj.recyce) ? url.replace('/deleteObject()','')+'/recycle()' : url;

    return $.ajax({
            url: url,
            type: 'POST',
            headers: {
                'Accept': 'application/json;odata=verbose',
                'X-Http-Method': 'DELETE',
                'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                'If-Match': obj.__metadata.etag
            }
    });
  }

  function deleteItem( obj ) {
    var dfd = $.Deferred( function( dfd ) {
      $.when( getSPListItem( obj ) ).done( function getForDelete( data ) {
        if (data.d.results.length) {
          data = $.extend( true, {}, data.d.results[0] , obj.data );
          $.when ( deleteSPListItem( data ) ).done( function performDelete( data ) {
              dfd.resolve( data );
            }).fail( function perdormDeleteFailed() {
              dfd.reject( data );
            });
        } else {
          dfd.reject( data );
        }
      }).fail( function getForDeleteFailed( data ) {
        dfd.reject( data );
      });
    });
    return dfd;
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

/**
* Retrieve items from a Sharepoint List
* @function get
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName and options (optional REST parameters)
* @returns {object} Returns a jQuery Promise.
*/
/**
* Retrieves a specific item from a Sharepoint List
* @function getById
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName and options (optional REST parameters)
* @returns {object} Returns a jQuery Promise.
*/
/**
* Adds a new item to a Sharepoint List
* @function add
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName, options (optional REST parameters) and data (JSON object) containing information for list item.
* @returns {object} Returns a jQuery Promise.
*/
/**
* Updates an existing item in a Sharepoint List
* @function update
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName, options (optional REST parameters) and data (JSON object) containing information for list item.
* @returns {object} Retuens a jQuery Promise.
*/
/**
* Removes a specific item from a Sharepoint List
* @function delete
* @memberof ept.listItem
* @param {object} obj = JSON object containing the sharepoint siteName, listName, options (optional REST parameters) and data (JSON object) containing information for list item.
* @returns {object} Retuens a jQuery Promise.
*/
 ept.listItem = {
    get: getSPListItems,
    getById : getSPListItem,
    add : createSPListItem,
    update : updateItem,
    delete : deleteItem
  };

})( jQuery, window, document, ept );
