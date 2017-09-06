(function(){

  'use strict';

  if (typeof String.prototype.startsWith !== 'function' ) {
   String.prototype.startsWith = function(str){
     return (this.match('^'+str)===str);
   };
  }

  if (typeof String.prototype.endsWith !== 'function' ) {
   String.prototype.endsWith = function(str) {
     return (this.match(str+'$')===str);
   };
  }

  if ( typeof String.prototype.toProperCase !== 'function' ) {
    String.prototype.toProperCase = function () {
      return this.toLowerCase().replace(/^(.)|\s(.)/g, function (t) { return t.toUpperCase(); });
    };
  }

  if (typeof String.prototype.pad !== 'function' ) {
    String.prototype.pad = function (i, e){
      var s = this;
      while( s.length < i ) { s = e ? e : '0' + s; }
      return s;
    };
  }

  if ( typeof String.prototype.includes !== 'function' ) {
    String.prototype.includes = function (t) {
      return this.indexOf(t) > -1;
    };
  }

  if ( typeof String.prototype.has !== 'function' ) {
    String.prototype.has = function (t) {
      return this.indexOf(t) > -1;
    };
  }

  if ( typeof String.prototype.replaceAll !== 'function' ) {
    String.prototype.replaceAll = function (t, e) {
      return this.split(t).join(e);
    };
  }

})();
