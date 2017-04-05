( function ( undefined ) {

'use strict';
var Tile,TileSet;

/*eslint-disable no-unused-vars */
var createTileSet = function() {
	var obj = {
		data 		: {},
		width 		: undefined,
		height 		: undefined,
		id 			: undefined,
		startAt		: undefined,
		startHeight	: undefined,
		startWidth 	: undefined,
		display    	: undefined,
		parent 		: undefined,
		el 			: undefined
	};
	obj.prototype = TileSet.prototype;
	return obj;
};

var createTile = function() {
	var obj = {
		data 		: {},
		badge 		: '',
		set 		: undefined,
		column 		: undefined,
		row 		: undefined,
		icon		: undefined,
		size 		: undefined,
		color 		: undefined,
		url 		: undefined,
		target 		: undefined,
		title 		: undefined,
		description : undefined,
		id 			: undefined,
		type 		: undefined,
		el 			: undefined,
		parent 		: undefined
	};
	obj.prototype = Tile.prototype;
	return obj;
};
/*eslint-enable no-unused-vars */

Tile = function () {
  var obj, ret;

  if ( this instanceof Tile ) {

	this.data 			= {};
	this.badge 			= '';
	this.set 			= undefined;
	this.column 		= undefined;
	this.row 			= undefined;
	this.icon			= undefined;
	this.size 			= undefined;
	this.color 			= undefined;
	this.url 			= undefined;
	this.target 		= undefined;
	this.title 			= undefined;
	this.description 	= undefined;
	this.id 			= undefined;
	this.type 			= undefined;
	this.el 			= undefined;
	this.parent 		= undefined;

  } else {

    obj = new Tile();
    ret = Tile.apply( obj, arguments );
    return ( ret === undefined ) ? obj : ret;

  }
};

Tile.prototype.init = function () {

	if ( typeof this.data === 'string' ) {
		try {
			this.data = JSON.parse( this.data );
		} catch( e ) {
			throw new Error( 'Tile Error: Unable to parse json data.' );
		}
	}

	this.url 				= ( this.url ) 				? this.url 				: ( this.data && this.data.url ) 			? this.data.url 			: undefined;
	this.id 				= ( this.id ) 				? this.id 				: ( this.data && this.data.id ) 			? this.data.id 				: undefined;
	this.title 				= ( this.title ) 			? this.title 			: ( this.data && this.data.title ) 			? this.data.title 			: undefined;

	this.set 				= ( this.set ) 				? this.set+'' 			: ( this.data && this.data.set ) 			? this.data.set+'' 			: '1';
	this.column 			= ( this.column )		 	? this.column 			: ( this.data && this.data.column ) 		? this.data.column			: 'A';
	this.row 				= ( this.row ) 				? this.row 				: ( this.data && this.data.row ) 			? this.data.row 			: 1;
	this.icon				= ( this.icon )			 	? this.icon 			: ( this.data && this.data.icon ) 			? this.data.icon 			: 'None';
	this.badge				= ( this.badge )		 	? this.badge 			: ( this.data && this.data.badge ) 			? this.data.badge			: 0;
	this.size 				= ( this.size ) 			? this.size 			: ( this.data && this.data.size ) 			? this.data.size 			: '2x2';
	this.color 				= ( this.color ) 			? this.color 			: ( this.data && this.data.color ) 			? this.data.color			: 'Gray';
	this.target 			= ( this.target ) 			? this.target 			: ( this.data && this.data.target )			? this.data.target			: '';
	this.type 				= ( this.type ) 			? this.type 			: ( this.data && this.data.type )			? this.data.type 			: 'standard';
	this.description 		= ( this.description ) 		? this.description 		: ( this.data && this.data.description )	? this.data.description		: '';
	this.tiledescription 	= ( this.tiledescription ) 	? this.tiledescription 	: ( this.data && this.data.tiledescription )? this.data.tiledescription : '';
	this.hasDescription 	= ( this.hasDescription ) 	? this.hasDescription 	: ( this.data && this.data.hasDescription )	? this.data.hasDescription	: '';
	this.parent 			= ( this.parent ) 			? this.parent 			: ( this.data && this.data.parent )			? this.data.parent 			: undefined;

	if ( ! this.set   )	{ throw new Error( 'Tile Error: Tileset has not been defined.' ); }
	if ( ! this.url   )	{ throw new Error( 'Tile Error: URL has not been defined.' ); }
	if ( ! this.title )	{ throw new Error( 'Tile Error: Title has not been defined.' ); }

	this.id = this.id || this.private.uniqueName( this );
	if ( ! this.id   )	{ throw new Error( 'Tile Error: ID has not been defined.' ); }

	this.hasBadge =  ( !this.badge ) ? 'macys-tile-no-badge' : 'macys-tile-has-badge';
	this.grouptileclass = ( this.type === 'group' ) ? 'macys-tile-popup' : '';
	this.tilelocation = this.column + this.row + '';

	this.hasDescription =  ( this.size === '1x1' || this.size === '2x1' || this.size === '1x2' ) ? 'macys-tile-no-desc' : (this.hasDescription)?this.hasDescription: 'macys-tile-no-desc' ;
};

Tile.prototype.add = function () {
	var html = '';
	this.init();
	this.data = this.templates.toJson( this );
	html = this.private.build( this );
	this.parent.appendChild( this.private.convertToElement( html ) );
	this.el = ( this.id ) ? document.getElementById( this.id ) : this.parent.querySelector( '[data-location=' + this.column + this.row + ']' );
	return this;
};

Tile.prototype.remove = function ( ) {
	var el = document.getElementById( this.id );
	el.parentNode.removeChild( el );
};

Tile.prototype.update = function () {
	this.remove(); this.add();
};

Tile.prototype.get = function ( id ) {
	this.data = document.getElementById( id ).getAttribute('data-tile');
	this.init();
};

Tile.prototype.private = {};

Tile.prototype.private.build = function ( x ) {
	var tmpl = x.private.templates.base();
	var type= x.type.toLowerCase();
	if (type === 'weather' || type === 'stocks') { x.type='standard'; }
	tmpl = x.private.replaceAll( tmpl, '{{html}}', x.templates[x.type]() );
	for (var prop in x ) {
		if( x.hasOwnProperty( prop ) ) {
			tmpl = x.private.replaceAll( tmpl, '{{'+prop+'}}', x[prop] );
		}
	}
	return tmpl;
};

Tile.prototype.private.convertToElement = function ( html ) {
	var el = document.createElement( 'div' );
	el.innerHTML = html;
	return el.firstChild;
};

Tile.prototype.private.uniqueName = function ( x ) {
	var tmp = 'tile-' + x.set.toString() + '-' + x.title.toString();
	return tmp.toLowerCase().replace(/\s+/g, '');
};

Tile.prototype.private.replaceAll = function ( str, find , replace ) {
  var re = new RegExp(find, 'g');
	return str.replace(re, replace);
};

Tile.prototype.private.templates = {};

Tile.prototype.private.templates.base = function () {
	return '<div id="{{id}}" data-tile-set="{{set}}" data-tile-type="{{type}}" data-location="{{tilelocation}}" class="macys-tile macys-tile-size-{{size}} macys-tile-color-{{color}} macys-tile-row{{row}} macys-tile-col{{column}} animated fadeIn" title="{{tiledescription}}" data-tile=\'{{data}}\' >'+
            '<a class="{{grouptileclass}} {{hasDescription}} {{hasBadge}}" href="{{url}}" target="{{target}}"  title="{{tiledescription}}">' +
              '<div class="macys-tile-html">{{html}}</div>' +
            '</a>'+
         '</div>';
};

Tile.prototype.templates = {};

Tile.prototype.templates.standard = function () {
	return	'<div class="macys-tile-front">'+
				'<div class="macys-tile-badge">{{badge}}</div>' +
				'<div class="macys-tile-main-icon macys-tile-icon macys-tile-icon-{{icon}}"></div>' +
				'<div class="macys-tile-BottomCenter macys-tile-title">{{title}}</div>'+
			'</div>'+
			'<div class="macys-tile-back">'+
				'<div class="macys-tile-back-header">{{title}}</div>' +
				'<div class="macys-tile-back-desc">{{description}}</div>' +
			'</div>' ;
};

Tile.prototype.templates.group = function () {
  return	'<div class="macys-tile-group macys-tile-no-desc macys-tile-front">'+
				'<div class="macys-tile-icon macys-tile-TopLeft macys-tile-icon-waffle"></div>' +
				'<div class="macys-tile-badge">{{badge}}</div>' +
				'<div class="macys-tile-main-icon macys-tile-icon macys-tile-icon-{{icon}}"></div>' +
				'<div class="macys-tile-BottomCenter macys-tile-title">{{title}}</div>'+
			'</div>'+
			'<div class="macys-tile-back">'+
				'<div class="macys-tile-back-header">{{title}}</div>' +
				'<div class="macys-tile-back-desc">{{description}}</div>' +
			'</div>' ;
};

Tile.prototype.templates.weather = function () {
  return	'<div class="macys-tile-weather macys-tile-no-desc">' +
				'<div class="macys-tile-weather-icon"><img src="{{image}}"/></div>' +
				'<div class="macys-tile-weather-temperature">{{temperature}}°</div>' +
				'<div class="macys-tile-weather-high">{{lowtemp}}° &nbsp;-&nbsp; {{hightemp}}°</div>' +
				'<div class="macys-tile-BottomCenter macys-tile-title">'+
					'<div class="macys-tile-header">{{title}}</div>'+
				'</div>' +
			'</div>';
};

Tile.prototype.templates.stocks = function () {
  return	'<div class="macys-tile-stocks macys-tile-no-desc">' +
				'<div class="macys-tile-stocks-date">{{date}}</div>' +
                '<div class="macys-tile-stocks-trend macys-tile-stocks-trend-{{trend}} macys-icon-{{trend}}"></div>' +
                '<div class="macys-tile-stocks-value">{{value}}</div>' +
                '<div class="macys-tile-stocks-change">{{change}}&nbsp;<span class="macys-tile-stocks-percentage">{{percent}}</span><span class="macys-linktile-super"><super>*</super></span></div>' +
				'<div class="macys-tile-BottomCenter macys-tile-title">'+
					'<div class="macys-tile-header">{{title}}</div>'+
				'</div>'+
            '</div>';
};

Tile.prototype.templates.toJson = function ( x ) {
	var tmp ='{';
	for( var prop in x ) {
		if( x.hasOwnProperty( prop ) ) {
            switch(prop){
                case 'el':
					tmp +='"'+prop+'" : "'+x['id']+'",';
                    break;
                case 'parent':
					tmp +='"'+prop+'" : "'+x[prop].id+'",';
                    break;
                case 'data':
                    break;
                default:
					tmp +='"'+prop+'" : "'+x[prop]+'",';
                    break;
            }
		}
	}
	tmp = tmp.slice( 0, ( tmp.length - 1 ) ) + '}';
	return tmp;
};

window.Tile = Tile;

/***************************************************** */
/***************************************************** */
/***************************************************** */

TileSet = function () {

  var obj, ret;

  if ( this instanceof TileSet ) {

	this.data 			= {};
	this.width 			= undefined;
	this.height 		= undefined;
	this.id 			= undefined;
	this.startAt		= undefined;
	this.startHeight 	= undefined;
	this.startWidth 	= undefined;
	this.display     	= undefined;
	this.parent 		= undefined;
	this.el 			= undefined;

  } else {

    obj = new TileSet();
    ret = TileSet.apply( obj, arguments );
    return ( ret === undefined ) ? obj : ret;

  }
};

TileSet.prototype.init = function () {

	this.id 	= ( this.id ) 		? this.id 		: ( this.data.id ) 		? this.data.id 		: undefined;
	this.width 	= ( this.width ) 	? this.width	: ( this.data.width ) 	? this.data.width 	: 2;
	this.height = ( this.height )	? this.height	: ( this.data.height ) 	? this.data.height 	: 1;
	this.startAt= ( this.startAt ) 	? this.startAt	: ( this.data.startAt ) ? this.data.startAt : 'A1';
	this.display= ( this.display ) 	? this.display	: ( this.data.display ) ? this.data.display : 'show';

	if ( ! this.id )	{
		this.id = this.private.uniqueName( this );
	}

	if ( ! this.parent )	{ throw new Error( 'TileSet Error: Parent has not been defined.' ); }

	this.private.getStart( this );
	this.private.build( this );
};

TileSet.prototype.getId = function() {
	return this.id;
};

TileSet.prototype.add = function ( arr ) {
	var i = 0, len = arr.length, t;
	for ( ; i < len ; i++ ) {
		t = new Tile();
		arr[i].parent = this.el;
		t.data = arr[i];
		t.add();
	}
};

TileSet.prototype.private = {};

TileSet.prototype.private.templates = {};

TileSet.prototype.private.templates.tileset = function () {
	return '<div id="{{id}}" class="macys-tile-container macys-tile-container-height-{{height}} macys-tile-container-width-{{width}} macys-tile-{{display}} " data-tileset="{{id}}"></div>';
};

TileSet.prototype.private.getStart = function ( x ) {
	var curr = 0, len = x.startAt.length, row = '', col = '', test, irow;
	for (; curr < len; curr++ ) {
		test = x.startAt.charAt( curr ) + '';
		if ( '0123456789'.indexOf( test ) > -1 ) {
			row += test.trim();
		} else {
			col += test.trim();
		}
	}

	if ( col.length === 0 ) {
		throw new Error( 'TileSet Error: Invalid starting location (column).' );
	}
	irow = parseInt( row, 10 );
	if ( irow < 1 || irow > 13 ) {
		throw new Error( 'TileSet Error: Invalid starting location (row).' );
	}
	x.startHeight = col;
	x.startWidth = row;
};

TileSet.prototype.private.convertToElement = function ( html ) {
	var el = document.createElement( 'div' );
	el.innerHTML = html;
	return el.firstChild;
};

TileSet.prototype.private.build = function ( x ) {
	var tmpl = x.private.templates.tileset(), p;
	tmpl = x.private.replaceAll( tmpl, '{{height}}', x.height );
	tmpl = x.private.replaceAll( tmpl, '{{id}}', x.id );
	tmpl = x.private.replaceAll( tmpl, '{{width}}', x.width );
	tmpl = x.private.replaceAll( tmpl, '{{startHeight}}', x.startHeight );
	tmpl = x.private.replaceAll( tmpl, '{{startWidth}}', x.startWidth );
	tmpl = x.private.replaceAll( tmpl, '{{display}}', x.display || 'show' );
	x.parent = p = document.querySelector( x.parent );
	p.appendChild( x.private.convertToElement( tmpl ) );
	x.el = p.querySelector('#'+x.id );
	if (x.display !== 'show' && x.display !== 'true') {
		x.parent.style.display='none';
	}
};

TileSet.prototype.private.replaceAll = function ( str, find , replace ) {
  var re = new RegExp(find, 'g');
	return str.replace(re, replace);
};

TileSet.prototype.private.uniqueName = function ( x ) {
	var tmp = 'tileset-';
	if ( ! x.id )  {
		x.id = Math.floor( Math.random() * 10000 );
	}
	tmp += x.id.toString().toLowerCase().replace(/\s+/g, '');
	return tmp;
};


window.TileSet = TileSet;

} ) ();
