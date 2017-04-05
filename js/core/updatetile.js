// requires prototypes.js base.js
/*global jQuery */
/*global ept */


/*********************************************** */
/* DEPRECATED CODE NEED TO REMOVE
/*********************************************** */

( function( $, window, document, ept ){

  'use strict';

 /**
 * URL properties
 * @namespace ept.tile
 */
  ept.tile ={};

/**
* Updates an existing Tile on the page
* @function update
* @memberof ept.tile
* @param {object} tile JSON Object represeting the tile
*/
  ept.tile.update = function ( data ) {
    var tile, tiles, tmp, tileset, tileface;
    tiles = $.parseJSON( data );
    tiles = tiles.tiles;

    tiles.forEach( function( currentTile ) {

    if ( currentTile.id ) {
      tile = $( '#' + currentTile.id );
      tileset = tile.parents('.macys-tile-container');
    } else {
      tileset = $( '[data-tileset=' + tile.tileset + ']' );
      tile = tileset.find( '[data-location=' + tile.location + ']' );
    }
    tileface = tile.find('a');

    if ( tile.length ) { tile = tile[0]; }

    if ( currentTile.color ) {
      ept.log('- Changing color to '+  currentTile.color);
      tile.className = updateClasses('macys-tile-color', tile.className, 'macys-tile-color-' + currentTile.color );
    }
    if (currentTile.icon ) {
      ept.log('- Changing icon to '+ currentTile.icon);
      tmp = tile.find('.macys-tile-icon');
      tmp[0].className = updateClasses('macys-tile-icon-', tmp[0].className, 'macys-tile-icon-' +currentTile.icon );
    }
    if (currentTile.title ) {
      ept.log('- Changing title to '+ currentTile.title);
      tile.find('.macys-title-header').html(currentTile.title );
    }
    if (currentTile.comments ) {
      ept.log('- Changing comments to '+ currentTile.comments);
      tile.find('.macys-title-desc').html(currentTile.comments );
      tile.find('a').removeClass('macys-tile-no-desc').addClass('macys-tile-desc');
    }
    if (currentTile.comments ==='<div></div>' ||currentTile.comments === '' ) {
      tile.find('.macys-title-desc').html( '' );
      tile.find('a').removeClass('macys-tile-desc').addClass('macys-tile-no-desc');
    }
    if (currentTile.description ==='' ||currentTile.description === '' ) {
      tile.find('.macys-title-desc').html( '' );
      tile.find('a').removeClass('macys-tile-desc').addClass('macys-tile-no-desc');
    }
    if (currentTile.badge ) {
      ept.log('- Adding icontext : '+ currentTile.text);
      tile.find('.macys-tile-icon-badge').html( currentTile.badge ).attr( 'data-badge', currentTile.badge );
  //    tile.find('.macys-tile-icon-text').html(currentTile.badge );
    }
    if (currentTile.url ) {
      ept.log('- Changing url to '+ currentTile.url);
      tile.find('a').attr('href',currentTile.url);
    }
    if (currentTile.target ) {
      ept.log('- Changing target to '+ currentTile.target);
      tile.find('a').attr('target',currentTile.target);
    }
    if (currentTile.size ) {
      ept.log('- Changing size to '+ currentTile.size);
      tile.className = updateClasses('macys-tile-size', tile.className, 'macys-tile-size-' +currentTile.size );
    }
    if (currentTile.moveTo ) {
      ept.log('- Moving Tile to '+ currentTile.moveTo);
      var col=currentTile.moveTo.toString().charAt(0),
            row=currentTile.moveTo.toString().replace(col,'');
      tile.className = updateClasses('macys-tile-col', tile.className, 'macys-tile-col' + col );
      tile.className = updateClasses('macys-tile-row', tile.className, 'macys-tile-row' + row );
      tile.attr('data-location',currentTile.moveTo);
    }
    if (currentTile.html) {
      ept.log('- Replacing Tile HTML ');
      tmp =currentTile.html.replaceAll('|','"');
      tileface.html(tmp);
    }

    tile.trigger('tilesupdated');
    });
  };

function updateClasses (partial, classes, addclass) {
  var len = 0,i=0, current, updated='';
  classes=classes.split(' ');
  len = classes.length;
  for(;i<len;i++) {
    current=classes[i];
    if (! current.has(partial)) {
      updated+=' ' +current;
    }
  }
  updated+=' '+addclass;
  return updated.trim();
}

/**
* Updates an existing Tile on the page
* @function updateTile
* @memberof ept
* @deprecated [See ept.tile.update]
* @param {object} tile JSON Object represeting the tile
*/
  ept.updateTile = function ( data ) {
    var tile, tiles, i, tmp, tileset, tileface;
    tiles = $.parseJSON( data );
    tiles=tiles.tiles;

    for( i=0; i < tiles.length;i++ ) {
      tileset = $( '[data-tileset=' + tiles[i].tileset + ']' );
      tile = tileset.find( '[data-location=' + tiles[i].location + ']');
      tileface = tile.find('a');

      ept.log('Modifying Tile at '+tiles[i].location+'...');
      if ( tiles[i].color ) {
        ept.log('- Changing color to '+  tiles[i].color);
        tile[0].className = updateClasses('macys-linktile-color', tile[0].className, 'macys-linktile-color-' + tiles[i].color );
      }
      if ( tiles[i].icon ) {
        ept.log('- Changing icon to '+  tiles[i].icon);
        tmp=tile.find('.macys-linktile-icon');
        tmp[0].className = updateClasses('mymacys-icon-', tmp[0].className, 'mymacys-icon-' + tiles[i].icon );
      }
      if ( tiles[i].title ) {
        ept.log('- Changing title to '+  tiles[i].title);
        tile.find('.macys-title-header').html( tiles[i].title );
      }
      if ( tiles[i].comments ) {
        ept.log('- Changing comments to '+  tiles[i].comments);
        tile.find('.macys-title-desc').html( tiles[i].comments );
        tile.find('a').removeClass('macys-tile-no-desc').addClass('macys-tile-desc');
      }
      if ( tiles[i].comments ==='<div></div>' || tiles[i].comments === '' ) {
        tile.find('.macys-title-desc').html( '' );
        tile.find('a').removeClass('macys-tile-desc').addClass('macys-tile-no-desc');
      }
      if ( tiles[i].text ) {
        ept.log('- Adding icontext : '+  tiles[i].text);
        tile.find('.macys-listtile-icon-text').html( tiles[i].text );
      }
      if ( tiles[i].url ) {
        ept.log('- Changing url to '+  tiles[i].url);
        tile.find('a').attr('href', tiles[i].url);
      }
      if ( tiles[i].target ) {
        ept.log('- Changing target to '+  tiles[i].target);
        tile.find('a').attr('target', tiles[i].target);
      }
      if ( tiles[i].size ) {
        ept.log('- Changing size to '+  tiles[i].size);
        tile[0].className = updateClasses('macys-listtile-size', tile[0].className, 'macys-listtile-size-' + tiles[i].size );
      }
      if ( tiles[i].moveTo ) {
        ept.log('- Moving Tile to '+  tiles[i].moveTo);
        var col=tiles[i].moveTo.toString().charAt(0),
            row=tiles[i].moveTo.toString().replace(col,'');
        tile[0].className = updateClasses('macys-tile-col', tile[0].className, 'macys-tile-col' + col );
        tile[0].className = updateClasses('macys-tile-row', tile[0].className, 'macys-tile-row' + row );
        tile.attr('data-location', tiles[i].moveTo);
      }
      if (tiles[i].html) {
        ept.log('- Replacing Tile HTML ');
        tmp = tiles[i].html.replaceAll('|','"');
        tileface.html(tmp);
      }

      tile.trigger('tilesupdated');
    }

  };

})(jQuery, window, document, ept);
