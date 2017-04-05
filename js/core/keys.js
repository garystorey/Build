// requires base.js
/*global jQuery */
/*global ept */

( function( $, window, document, ept ) {

  'use strict';

/**
 * Contains references to all keys (ex: ept.keys.TAB, ept.keys.ENTER, etc)
 * @namespace ept.keys
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent?redirectlocale=en-US&redirectslug=DOM%2FKeyboardEvent
 */
  ept.keys = {
    //Reference at https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent?redirectlocale=en-US&redirectslug=DOM%2FKeyboardEvent
    CANCEL : 3, HELP : 6, BACKSPACE : 8, TAB : 9, CLEAR : 12, ENTER : 13, SHIFT : 16, CTRL : 17, CONTROL: 17, ALT : 18, OPTION : 18,
    PAUSE: 19, CAPSLOCK :20, ESC : 27, ESCAPE : 27, SPACE : 32, PAGEUP : 33, PAGEDOWN : 34, END: 35, HOME : 36, LEFTARROW : 37,
    UPARROW : 38, RIGHTARROW : 39, DOWNARROW : 40, PRINTSCREEN : 44, PRINT : 44, INSERT : 45, INS : 45, DELETE : 46, ZERO : 48,
    ONE : 49, TWO : 50, THREE : 51, FOUR : 52, FIVE : 53, SIX : 54, SEVEN : 55, EIGHT : 56, NINE : 57, COLON : 58, SEMICOLON : 59,
    LESSTHAN : 60, EQUAlS : 61, GREATERTHAN : 62, QUESTIONMARK : 63, AT : 64, WIN : 91, WINDOWS:91, CONTEXTMENU : 93, NUMPAD0 : 96,
    NUMPAD1 : 97, NUMPAD2 : 98, NUMPAD3 : 99, NUMPAD4 : 100, NUMPAD5 : 101, NUMPAD6 : 102, NUMPAD7 : 103, NUMPAD8 : 104, NUMPAD9 : 105,
    NUMPADMULTIPLY : 106, NUMPADADD : 107, NUMPADSUBTRACT : 109, NUMPADDECIMAL : 110, NUMPADDIVIDE : 111, F1 : 112, F2 : 113, F3 : 114,
    F4 : 115, F5 : 116, F6 : 117, F7 : 118, F8 : 119, F9 : 120, F10 : 121, F11 : 122, F12 : 123, F13 : 124, F14 : 125, F15 : 126,
    F16 : 127, F17 : 128, F18 : 129, F19 : 130, F20 : 131, F21 : 132, F22 : 133, F23 : 134, F24 : 135, NUMLOCK : 144, SCROLLLOCK : 145,
    CIRCUMFLEX : 160, CARET : 160, EXCLAMATION : 161, DOUBLEQUOTE : 162, HASH : 163, DOLLAR : 164, PERCENT : 165, ANDPERSAND : 166,
    AND : 166, UNDERSCORE : 167, OPENPAREN : 168, CLOSEPAREN : 169, ASTERISK : 170, PLUS : 171, PIPE : 172, HYPHEN : 173, MINUS : 173,
    OPENCURLY : 174, CLOSECURLY : 175, TILDE : 176, VOLUMEMUTE : 181, VOLUMEDOWN : 182, VOLUMEUP : 183, COMMA : 188, PERIOD : 189, SLASH : 190,
    BACKQUOTE : 191, OPENBRACKET : 219, BACKSLASH : 220, CLOSEBRACKET : 221, QUOTE : 222, META : 224, COMMAND : 224
  };

/**
* Returns true/false if the {key} is used in the {event}
* @function compareKey
* @memberof ept
* @param {object} event = jQuery event object
* @param {string} key = key to compare
* @returns {boolean}
*/
  ept.compareKey = function ( event , key ) {
    return ept.isTrue( ept.getKey( event ) === key);
  };

/**
* Returns the key value from an event object
* @function getKey
* @memberof ept
* @param {object} event = jQuery event object
* @returns {number} the value of the key in the event
*/
  ept.getKey = function ( event ) {
    return (event.keyCode ? event.keyCode : event.which);
  };

})(jQuery, window, document, ept);
