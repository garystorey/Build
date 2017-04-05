// requires prototypes.js base.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ){

  'use strict';

  var epttoday = new Date();
/**
 * Date/Time properties
 * @namespace ept.date
 */
  ept.date = {
/**
* Current Date/Time
* @property {date} today Current Date/Time
* @memberof ept.date
*/
    today : epttoday,
/**
* Current Day as two-digit string
* @property {string} day Current Day as two-digit string
* @memberof ept.date
*/
    day : epttoday.getDate().toString().pad(2),
/**
* Current Month as two-digit string
* @property {string} day Current Month as two-digit string
* @memberof ept.date
*/
    month : (epttoday.getMonth()+ 1).toString().pad(2),
/**
* Current Year as four-digit string
* @property {string} day Current Year as four-digit string
* @memberof ept.date
*/
    year : epttoday.getFullYear() + '',
/**
* Current Hours as two-digit string
* @property {string} day Current Hours as two-digit string
* @memberof ept.date
*/
    hours : epttoday.getHours().toString().pad(2),
/**
* Current Minutes as two-digit string
* @property {string} day Current Minutes as two-digit string
* @memberof ept.date
*/
    minutes : epttoday.getMinutes().toString().pad(2),
/**
* Current Seconds as two-digit string
* @property {string} day Current Seconds as two-digit string
* @memberof ept.date
*/
    seconds : epttoday.getSeconds().toString().pad(2),
/**
* Number of milliseconds since 1/1/1070
* @property {number} day Number of milliseconds since 1/1/1070
* @memberof ept.date
*/
    now : epttoday.getTime(),
/**
* Number of milliseconds in a week
* @property {number} day Number of milliseconds in a week
* @memberof ept.date
*/
    oneweek : 86400000*7,
/**
* Number of milliseconds in two days
* @property {number} day Number of milliseconds in two days
* @memberof ept.date
*/
    twodays : 86400000*2
  };

/**
* Returns a datetime string in the correct format for using the SP REST API's.
* @function spdatetime
* @memberof ept
* @param {string} date = A datetime object or string representing a date
* @param {string} [options] = Additional REST arguments
* @returns {string} Date converted to fomat for SP REST APIs
*/
  ept.spdatetime = function( d ) {
    //specifically using double quotes because of required single quoes in the string
    var str='';
    d = new Date(d);
    str += "datetime'" + d.getFullYear().toString() + "-" + (d.getMonth()+1).toString().pad(2) + "-" + d.getDate().toString().pad(2) + "";
    str += "T" + d.getHours().toString().pad(2) + ":" + d.getMinutes(2).toString().pad(2) + ":" + d.getSeconds().toString().pad(2) + "'";
    return str;
  };

/**
* Gets the difference between to date/tims and returns a simple string with the difference
* @function prettyDate
* @memberof ept
* @param {string} time = A datetime object or string representing a date
* @param {string} [now] = Default: Current Date/Time. A datetime object or string representing a date
* @returns {string} A string representing the time difference (ex: 10 minutes ago , etc.)
*/
  ept.prettyDate = function (  time, now ) {
    var date = new Date( time || ''),
        curr = new Date( now || epttoday );

        var diff = ( ( curr.getTime() - date.getTime() ) / 1000 ),
        day_diff = Math.floor( diff / 86400 ), result;

    if ( isNaN( day_diff ) || day_diff < 0 || day_diff >= 31 ) { return; }

    result = day_diff === 0 &&
      (   diff < 60 && 'just now' || diff < 120 && '1 minute ago' ||
          diff < 3600 && Math.floor(diff / 60) + ' minutes ago' ||
          diff < 7200 && '1 hour ago' ||
          diff < 86400 && Math.floor(diff / 3600) + ' hours ago'
      ) ||
          day_diff === 1 && 'Yesterday' || day_diff < 7 && day_diff + ' days ago' ||
          day_diff < 31 && Math.ceil( day_diff / 7) + ' weeks ago';

    return result;
  };

  epttoday = null;

}(jQuery, window, document, ept));
