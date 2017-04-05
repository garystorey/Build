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

// requires prototypes.js
/*global macysEditMode */

(function () {

    'use strict';
    /**
     * Enterprise Portal Team
     * @namespace ept
     * @author Gary Storey ( gary.storey@macys.com )
     */
    var ept = {
        /**
         * Turns on logging on or off
         * @see ept.log
         * @property {boolean} debug Turns logging on/off
         * @memberof ept
         */
        debug: false,
        /**
         * URL of main support page
         * @property {string} supportURL URL of main support page
         * @memberof ept
         */
        supportURL: 'http://mymacys.net/sites/EPT/workrequest/Pages/CustomerRequest.aspx',
        onLoadFunctions: [] //array to hold onload events
    };

    /**
     * Checks to see if you are currently in Sharepoint Edit mode on a page
     * @function isEditMode
     * @memberof ept
     * @returns {Boolean}
     */
    ept.isEditMode = function () {
        return !(typeof macysEditMode === 'undefined' || $('#MSOLayout_InDesignMode').val() === '');
    };

    /**
     * Logs {txt} message to the console after verifying console exists and ept.debug is true
     * @function log
     * @memberof ept
     * @param {string} txt Information to log to console
     */
    ept.log = function (txt) {
        /* eslint-disable no-console */
        if (window.console && console.log && ept.debug) {
            console.log(txt);
        }
        /* eslint-enable no-console */
    };

    /**
     * Is the current browser touch capable;
     * @function isTouch
     * @memberof ept
     * @returns {Boolean}
     */
    ept.isTouch = function () {
        return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
    };

    /**
     * Removes all HTML tags from the current string
     * @function removeHTML
     * @memberof ept
     * @param {string} htmlString  String to parse
     * @returns {string}
     */
    ept.removeHTML = function (htmlString) {
        if (htmlString) {
            var mydiv = document.createElement('div');
            mydiv.innerHTML = htmlString;
            return (document.all) ? mydiv.innerText : mydiv.textContent;
        }
        return '';
    };


    /**
     * Loops through NodeLists like an array
     * @function forEach
     * @memberof ept
     * @param {array} array  arraylike object including NodeLists
     * @param {function} callback  callback function to execute for each item
     * @param {string} [scope]  Optional. Provide a scope, default to global. Usually not needed.
     */
    ept.forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    };

    /**
     * Creates an HTML element based on JSON object
     * @function createElement
     * @memberof ept
     * @param {object} JSON Object {tag:'div' ,id:'', classes=['class1',class2], text:'Hello World', parentEl : element }
     * @returns {element};
     */

    ept.createElement = function (data) {
        var el, txt, len;
        if (typeof data === 'string') {
            el = document.createElement('div');
            el.innerHTML = data;
            return el.firstChild;
        }
        el = document.createElement(data.tag);
        txt = document.createTextNode(data.text);
        el.appendChild(txt);
        if (data.id) {
            el.setAttribute('id', data.id);
        }
        if (data.classes) {
            len = data.classes.length;
            while (len--) {
                el.classList.add(data.classes[len]);
            }
        }
        return el;
    };

    /**
     * Removes all special characters from a string
     * @function removeSpecialChars
     * @memberof ept
     * @param {string} str  string to remove special characters from
     */
    ept.removeSpecialChars = function (str) {
        return str.replace(/[^\w\s]/gi, '');
    };

    /**
     * Removes all spaces from a string
     * @function removeSpaces
     * @memberof ept
     * @param {string} str  string to remove spaces from
     */
    ept.removeSpaces = function (str) {
        return str.replaceAll(' ', '');
    };

    /**
     * Add a function to be called after page load is completed
     * @function onLoad
     * @memberof ept
     * @param {string} cb  Name of function to call after page load
     */
    ept.onLoad = function (cb) {
        ept.onLoadFunctions.push(cb);
    };
    ept.onload = ept.onLoad;

    /**
     * Execute functions after page load
     * @function onLoad
     * @memberof ept
     * @private
     */
    ept.executeOnLoad = function () {
        var func = ept.onLoadFunctions,
            len = func.length,
            i = 0,
            curr;
        if (len > 0) {
            for (; i < len; i++) {
                curr = func[i];
                ept.private.executeFunctionByName(curr);
            }
        }
        var el = document.body;
        var event = document.createEvent('Event');
        event.initEvent('onLoadComplete', true, true);
        el.dispatchEvent(event);
    };

    /**
     * Private methods
     * @namespace ept.private
     */
    ept.private = {

        executeFunctionByName: function (functionName, context) {
            context = context || window;
            var namespaces = functionName.split('.');
            var func = namespaces.pop();
            for (var i = 0, len = namespaces.length; i < len; i++) {
                context = context[namespaces[i]];
            }
            return context[func].apply(this);
        },

        setClasses: function () {
            var ua = navigator.userAgent.toString().toLowerCase();
            var url = location.href;
            if (url.indexOf('_layout')>-1 || url.indexOf('_catalog')>-1 || url.indexOf('/Lists/')>-1 || url.indexOf('/Forms/')>-1 ) {
                document.body.classList.add('systempage');
            }
            document.body.classList.add('js');
            document.body.classList.remove('no-js');

            if (ua.indexOf('trident') > -1) {
                document.body.classList.add('ie');
            }
            if (ua.indexOf('ipad') > -1) {
                document.body.classList.add('ipad');
            }
            if (ua.indexOf('android') > -1) {
                document.body.classList.add('android');
            }
        }
    };

    window.ept = ept;
}());


/***************************************************************************
 ****************************************************************************
 **** After page load
 ****************************************************************************
 ****************************************************************************/

(function (ept) {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        ept.private.setClasses();
        ept.executeOnLoad();
    });
})(ept);

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

//requires base.js
/*global ept */

(function (ept) {

    'use strict';
    var tiles = {};

    var tilesArray = [];

    /* Helper functions */
    /***************************************/
    /***************************************/


    var attr = function (el, attribute) {
        return el.getAttribute('data-' + attribute);
    };

    var getTileSetObject = function () {
        return {
            tiles: [],
            height: 1,
            width: 2,
            display: 'hide',
            parent: '',
            set: ''
        };
    };

    var hasDescription = function (size, title) {
        title = title.trim();
        return ((size !== '1x1' || size !== '2x1' || size !== '1x2') && title) ? 'macys-tile-desc' : 'macys-tile-no-desc';
    };

    var hideTileSets = function () {
        var hiddenTileSets = document.querySelectorAll('.macys-tile-container');
        ept.forEach(hiddenTileSets, function (el) {
            if (!el.classList.contains('macys-tile-show')) {
                if (!el.classList.contains('macys-tile-hide')) {
                    //should have one or the other so it has been "shown" on the screen
                    //console.log(el.id);
                    el.classList.add('macys-tile-hide');
                    el.parentNode.setAttribute('style', '');
                }
            }
        });
    };

    var hideOverlay = function () {
        var overlay = document.querySelector('.macys-tile-overlay');
        var showing = overlay.getAttribute('data-show') + ''.toLowerCase();

        overlay.style.display = 'none';
        overlay.setAttribute('data-opener', '');
        overlay.setAttribute('data-showing', '');
        showing = document.getElementById(showing);
        showing.setAttribute('style', '');
        showing.style.display = 'none';
        showing.querySelector('.macys-tile-container').classList.add('macys-tile-hide');
    };

    var appendOverlay = function () {
        var overlay = document.querySelector('.macys-tile-overlay');
        if (!overlay) {
            overlay = ept.createElement({
                tag: 'div',
                text: '',
                id: '',
                classes: ['macys-tile-overlay']
            });
        }
        document.body.appendChild(overlay);
        overlay.addEventListener('click', hideOverlay);
        return overlay;
    };

    var getTileObject = function () {
        return {
            title: '',
            id: '',
            set: '',
            badge: '',
            type: 'standard',
            url: '#',
            icon: 'None',
            color: 'Red',
            size: '1x1',
            row: 'A',
            column: '1',
            target: '',
            description: '',
            tiledescription: '',
            hasDescription: 'macys-tile-no-desc',
            isGroupTile: false
        };
    };

    var parseUrl = function (url) {
        ept.log('fn:parseUrl');
        var settings = {};
        var tmp = url.split('?');
        url = tmp[1];
        if (url) {
            var aCouples = url.split('&');
            //we need to get qs values
            if (aCouples.length) {
                for (var aItKey, nKeyId = 0; nKeyId < aCouples.length; nKeyId++) {
                    aItKey = aCouples[nKeyId].toString().toLowerCase().split('=');
                    settings[decodeURI(aItKey[0])] = aItKey.length > 1 ? decodeURI(aItKey[1]) : '';
                }
            }
        }
        //make sure we have required values
        if (!settings.set) {
            settings.set = '1';
        } else {
            settings.set = settings.set.trim();
        }
        if (!settings.startLocation) {
            settings.startLocation = 'A1';
        } else {
            settings.startLocation = settings.startLocation.trim();
        }
        if (!settings.height) {
            settings.height = '1';
        } else {
            settings.height = settings.height.trim();
        }
        if (!settings.width) {
            settings.width = '2';
        } else {
            settings.width = settings.width.trim();
        }
        return settings;
    };

    var processLI = function (li, i, setObj) {
        var a = li.querySelector('a');
        var size = attr(li, 'size') + '';
        var title = a.innerHTML;
        var type = attr(li, 'type') + '';
        var current = getTileObject();
        var desc = a.getAttribute('title');
        desc = (desc) ? desc + '' : '';

        ept.log('i:' + i);

        type = type.toLowerCase();

        current.title = title.trim();
        current.id = setObj.set + '-' + (i + 1);
        current.set = setObj.set + '';
        current.badge = attr(li, 'badge') + '';
        current.icon = attr(li, 'icon') + '';
        current.color = attr(li, 'color') + '';
        current.size = size;
        current.row = attr(li, 'row') + '';
        current.column = attr(li, 'column') + '';
        current.description = desc;
        current.tiledescription = a.getAttribute('title');
        current.hasDescription = hasDescription(size, desc);
        current.target = a.getAttribute('target') + '';
        current.type = type;

        if (type === 'standard') {
            current.isGroupTile = false;
            current.url = a.getAttribute('href');
        }

        if (type === 'group') {
            var setInfo = parseUrl(a.getAttribute('href'));
            var url = "javascript:tiles.open('{{set}}','" + current.set + "');";
            current.isGroupTile = true;
            current.url = url.replace('{{set}}', ept.removeSpecialChars(ept.removeSpaces(setInfo.set)));
        }

        if (type === 'weather' || type === 'stocks') {
            current.isGroupTile = false;
            current.url = '#';
            ajax('http://mymacys.net/Pages/stockandweatherdata.aspx?type=' + type, processData);
        }
        return current;
    };

    var processData = function (data) {
        ept.log(data);
    };

    var processSet = function (set, i) {
        var setName = attr(set, 'tileset');
        var allLIs = set.querySelectorAll('li');
        var tilesetObject = getTileSetObject();

        ept.log('i:' + i);

        tilesetObject.parent = '#tileset-holder-' + setName;
        tilesetObject.display = attr(set, 'display') + '';
        tilesetObject.set = setName;
        tilesetObject.height = attr(set, 'tile-height') + '';
        tilesetObject.width = attr(set, 'tile-width') + '';

        ept.forEach(allLIs, function (li, i) {
            tilesArray.push(processLI(li, i, tilesetObject));
        });

        tilesetObject.tiles = tilesArray;
        tiles.createSet(tilesetObject);
        tilesArray.length = 0;
    };

    var getHeight = function (el) {
        var a = [el.scrollHeight, el.clientHeight, el.offsetHeight].sort();
        return a[0] + 10;
    };
    var getWidth = function (el) {
        var a = [el.scrollWidth, el.clientWidth, el.offsetWidth].sort();
        return a[0] + 10;
    };

    var centerTileSet = function (el) {
        ept.log('fn:centerTileSet');
        var top = Math.max(0, ((window.innerHeight - getHeight(el)) / 2));
        var left = Math.max(0, ((window.innerWidth - getWidth(el)) / 2));
        if (top > 250) {
            top = 250;
        }
        el.style.top = top + 'px';
        el.style.left = left + 'px';
    }

    var createCORSRequest = function (url, method) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    };

    var ajax = function (url, callback, method) {
        method = method || 'GET';
        var xhr = createCORSRequest(url, method);
        if (!xhr) {
            ept.log('CORS not supported');
            return;
        }
        xhr.onload = function () {
            callback(xhr.reponseText);
        };

        xhr.onerror = function () {
            ept.log('Woops, there was an error making the request.');
        };

        xhr.send();
    };

    /***************************************/
    /***************************************/

    tiles.check = function (event, data) {
        var area, tilesets, el;
        ept.log('mp.menu.tiles.check');
        ept.log('event: ' + event); //we dont need it but since we defined it....

        //Only returns true if we are in Edit Mode in SP
        if (ept.isEditMode()) {
            return;
        }
        area = (data) ? document.getElementById(data.id) : document.body;
        tilesets = area.querySelectorAll('ul[data-tileset]');
        ept.forEach(tilesets, function (set, i) {
            el = ept.createElement({
                tag: 'div',
                id: 'tileset-holder-' + attr(set, 'tileset'),
                text: ''
            });
            tilesets[i].parentNode.appendChild(el);
            processSet(set, i);
            set.parentNode.removeChild(set);
        });
    };

    tiles.createSet = function (settings) {
        ept.log('fn:mp.menu.tiles.createSet');
        var tsid;
        /* eslint-disable no-undef */
        var ts = new TileSet();
        /* eslint-enable no-undef */
        ts.parent = settings.parent;
        ts.height = settings.height;
        ts.width = settings.width;
        ts.display = settings.display;
        ts.startAt = 'A1';
        ts.init();
        ts.add(settings.tiles);
        tsid = ts.getId();
        ts = null;
        return tsid;
    };

    tiles.open = function (setToShow, currentSet) {
        var parent = document.getElementById('tileset-holder-' + setToShow);
        var el = parent.querySelector('.macys-tile-container');
        var overlay = appendOverlay();
        hideTileSets();
        overlay.setAttribute('data-opener', 'tileset-holder-' + currentSet);
        overlay.setAttribute('data-show', 'tileset-holder-' + setToShow);
        overlay.style.display = 'block';
        overlay.style.transform = 'scale(1)';
        parent.style.backgroundColor = '#fff';
        parent.style.position = 'absolute';
        parent.style.display = 'block';
        parent.style.zIndex = 1000001;
        parent.style.padding = '10px';
        centerTileSet(parent);
        el.classList.remove('macys-tile-hide');
    };

    window.tiles = tiles;

    ept.onLoad('tiles.check');

})(ept);
