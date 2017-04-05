// requires prototypes.js base.js async.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ){

'use strict';

  function formatUserData( data ) {
    var user, temp, len, i;
    if (data.d) {
      user = data.d;
      temp = data.d.UserProfileProperties.results;
      len = temp.length;

      for( i = len; i--; ) {
        var key = temp[i].Key.toString(), val = temp[i].Value;
        key = key.replace( 'SPS-', 'sps' ).replace( 'fds-', 'fds' ).replace( 'Zl', 'zl' );
        if ( key.toString().indexOf( 'FirstName LastName PreferredName fdsNickName ') > -1 ) { key = val.toString().toProperCase(); }
        user[key] = val;
      }
      user.Picture = '/_layouts/15/userphoto.aspx?size=S&accountname='+user.Email;
      return user;
    } else {
      return false;
    }
  }

  function getUserProperties( id ) { //Pass id
    id = id || '';
    id = id.toString();
    var myurl = ( id ) ? "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='Federated\\" + id + "'" : '/_api/SP.UserProfiles.PeopleManager/GetMyProperties';
    return ept.ajax( { url : myurl } );
  }


  function getCurrentUser() {
      var dfd = $.Deferred( function( dfd ) {
        $.when( getUserProperties() ).done( function ajaxUserData( data ) {
            var results = formatUserData( data );
            ept.user = results;
            dfd.resolve( results );
            $(document).trigger('userDataLoaded');
        }).fail( function ajaxUserDataFailed( data ) {
            dfd.reject( data );
        });
      });
      return dfd;
  }

  function getUser( id ) {
    var dfd = $.Deferred( function( dfd ) {
      $.when( getUserProperties( id )  ).done( function ajaxUserDataByID( data ) {
        if ( data.d.AccountName ) {
          dfd.resolve( formatUserData( data ) );
          $(document).trigger('userDataLoaded');
        } else {
          dfd.reject( data );
        }
      }).fail( function ajaxUserDataByIDFailed( data ) {
        dfd.reject( data );
      });
    });
    return dfd;
  }


/**
* Get a URL to the the current users picture
* @function getUserPicUrl
* @memberof ept
* @returns {string} URL to the the current users picture
*/
  ept.getUserPicUrl = function() {
    return '/_layouts/15/userphoto.aspx?size=M&accountname=' +ept.user.Email;
  };

/**
* Reads the current users Employee ID from the page
* @function getEmployeeID
* @memberof ept
* @returns {string} The Employee ID of the current user
*/
  ept.getEmployeeID = function () {
    return $( 'meta[name=Employeeid]' ).attr( 'content' )+'' || '';
  };

/**
* Reads the current users Business Unit(s) from the page
* @function getNavFOB
* @memberof ept
* @returns {string} Comma delimited string of the Business Units the user belongs to
*/
  ept.getNavFOB = function () {
    return $( 'meta[name=NavFOB]' ).attr( 'content' ) + '' || '';
  };

  ept.fixUserID = function ( id ) {
    id = id.replace( 'federated', '' );
    id = 'B' + id;
    id = id.replace( 'Bb', 'b' );
    return id;
  };

/**
* Read the given users profile data
* @function getUser
* @memberof ept
* @param {string} [id] = Optional. The User ID. If blank, retunrs the current user
* @returns {object} A jQuery Promise
*/
  ept.getUser = function ( id ) {
    return (id) ? getUser( id ) : getCurrentUser();
  };

  //if we arent in the macys partners domain, load the user profile
  if (location.hostname.indexOf('macyspartners')===-1) {
    ept.getUser();
  }

})( jQuery, window, document, ept );
