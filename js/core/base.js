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
