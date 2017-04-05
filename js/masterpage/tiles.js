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
