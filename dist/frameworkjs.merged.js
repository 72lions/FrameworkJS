/*
    http://www.JSON.org/json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
var FrameworkJS = {

    /**
     * An object holding all the different classes
     *
     * @private
     * @type Object
     */
    _classes: {},

    /**
     * An object holding all the different class _types
     *
     * @private
     * @type Object
     */
    _types: {},

    /**
     * Extends a function
     * @param  {Function} what      The function that we want to extend
     * @param  {Function} withWhat  The class that we want to use for extending
     * @param  {String} classType The class type of the new extended function
     * @return {FrameworkJS.Model || FrameworkJS.View || FrameworkJS.Controller || FrameworkJS.Service}
     */
    extend: function (what, withWhat, classType) {

        if (typeof what !== 'undefined') {
            if (typeof what.prototype !== 'undefined') {
                if (typeof withWhat === 'function') {
                    what.prototype = new withWhat();
                    if (typeof FrameworkJS._types[classType] === 'undefined'){
                        FrameworkJS._types[classType] = what;
                    } else {
                        /*console.log('FrameworkJS.extend: You are trying to register an object type that already exists... Nothing will happen')*/;
                    }
                    return what;
                } else {
                    /*console.log('FrameworkJS.extend: Invalid source object')*/;
                    return null;
                }
            } else {
                /*console.log('FrameworkJS.extend: Target object has no prototype')*/;
                return null;
            }
        } else {
            /*console.log('FrameworkJS.extend: Target object is null')*/;
            return null;
        }
    },

    /**
     * Returns a Model, View or Controller based on the class type and id. If there is no object initialized with that id and class type then one is created
     * @param  {String} id        The id of the class that we want to get
     * @param  {String} classType The class type of the object that we want to get
     * @param  {[type]} type      The type of the base class. e.x. 'model', 'view' or 'controller'
     * @return {FrameworkJS.Model || FrameworkJS.View || FrameworkJS.Controller}
     * @author Thodoris Tsiridis
     */
    retrieve: function (id, classType, type) {

        var className, id, model, controllerObj;
        var exists = -1;

        className = classType || 'Generic.Controller';
        id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

        // Check if there is an array with objects of className type
        // If not then create a new array
        if(!FrameworkJS._classes[className] || !FrameworkJS.Utils.isArray(FrameworkJS._classes[className])) {
            FrameworkJS._classes[className] = [];
        }

        // Loop through al the items in the array
        // to check if an item with this id already exists
        for (var i = FrameworkJS._classes[className].length - 1; i >= 0; i--) {
            if(FrameworkJS._classes[className][i].id == id){
                exists = i;
                break;
            }
        }

        if(exists === -1){
            // Check if the class that we want to load exists
            if(FrameworkJS._types[className] !== undefined){
                controllerObj = {id: id, classType: new FrameworkJS._types[className]()};
            } else {
                // Create a generic controller
                controllerObj = {id: id, classType: new FrameworkJS.Controller()};
            }

            FrameworkJS._classes[className].push(controllerObj);
            controllerObj.classType.id = id;
            return controllerObj.classType;

        } else {
            return FrameworkJS._classes[className][exists].classType;
        }

    },

    /**
     * A controler constant
     *
     *@type String
     * @property CONTROLLER
     * @default 'controller'
     */
    CONTROLLER: 'controller',

    /**
     * A view constant
     *
     *@type String
     * @property VIEW
     * @default 'view'
     */
    VIEW: 'view',

    /**
     * A model constant
     *
     *@type String
     * @property MODEL
     * @default 'model'
     */
    MODEL: 'model',

    /**
     * A service constant
     *
     *@type String
     * @property SERVICE
     * @default 'service'
     */
    SERVICE: 'service'

};
/**
 * The Publisher
 *
 * @module 72lions
 * @class Publisher
 * @namespace FrameworkJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FrameworkJS.Publisher = ( function() {

    /**
     * The object that holds all the subscribers
     *
     * @private
     * @type Object
     * @default {}
     */
    var _subscribers = {};

    return {


        /**
         * Registers a subscriber
         *
         * @param  {String} message    The message on which it will register the subscriber
         * @param  {Function} subscriber The subscriber
         * @author Thodoris Tsiridis
         */
        subscribe: function(message, subscriber) {

            if (typeof message !== 'undefined' && typeof subscriber !== 'undefined') {

                if (typeof _subscribers[message] === 'undefined') {
                    _subscribers[message] = [];
                }

                if (_subscribers[message].indexOf(subscriber) === -1) {
                    _subscribers[message].push(subscriber);
                }

            } else {
                /*console.log('FrameworkJS.Publisher.subscribe: You must provide a message and a subscriber')*/;
            }
        },

        /**
         * Registers a subscriber
         *
         * @param  {String} message    The message on which it will register the subscriber
         * @param  {Function} subscriber The subscriber
         * @author Thodoris Tsiridis
         */
        unsubscribe: function(message, subscriber) {
            var index;

            if (typeof message !== 'undefined' && typeof subscriber !== 'undefined') {
                if (typeof _subscribers[message] !== 'undefined') {
                    index = _subscribers[message].indexOf(subscriber);
                    if ( index !== -1) {
                        _subscribers[message].splice(index, 1);
                    }
                } else {
                    /*console.log('Warning: FrameworkJS.Publisher.unsubscribe: There are no subscribers for that message')*/;
                }
            } else {
                /*console.log('FrameworkJS.Publisher.unsubscribe: You must provide a message and a subscriber')*/;
            }
        },

        /**
         * It will notify all the registered subscribers
         *
         * @param  {String} message The message that will be used for notifying the subscribers
         * @param {Object} args The arguments that will passed on the subscriber
         * @author Thodoris Tsiridis
         */
        notify: function(message, args) {
            var subscribers;

            if (typeof message !== 'undefined') {
                subscribers = _subscribers[message];
                if (typeof subscribers !== 'undefined') {
                    for (var i = 0; i < subscribers.length; i++) {
                        if (typeof subscribers[i].onNotify !== 'undefined') {
                            subscribers[i].onNotify.call(subscribers[i], {message: message, params: args || {} });
                        }
                    };
                } else {
                    /*console.log('Warning: FrameworkJS.Publisher.notify: There are no subscribers for that message')*/;
                }
            } else {
                /*console.log('FrameworkJS.Publisher.notify: You must provide a message')*/;
            }
        }

    }

}) ();
/**
 * The Ajax
 *
 * @module 72lions
 * @class Ajax
 * @namespace FrameworkJS
 * @requires JSON2.js
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FrameworkJS.Ajax = function(settings) {

    /**
     * The constant for the post method type
     *
     * @type String
     * @default 'POST'
     */
    this.POST = 'POST';

    /**
     * The constant for the get method type
     *
     * @type String
     * @default 'GET'
     */
    this.GET = 'GET';

    /**
     * The constant for the json data type
     *
     * @type String
     * @default 'json'
     */
    this.JSON = 'json';

    /**
     * The constant for the xml data type
     *
     * @type String
     * @default 'xml'
     */
    this.XML = 'xml';

    /**
     * The constant for the text data type
     *
     * @type String
     * @default 'text'
     */
    this.TEXT = 'text';

    /**
     * The object that holds all the settings
     *
     * @private
     * @type Object
     * @default {}
     */
    var _settings = {};

    /**
     * The method type
     *
     * @private
     * @type String
     * @default 'GET'
     */
    _settings.method = settings.method || this.GET;

    /**
     * The data type
     *
     * @private
     * @type String
     * @default 'text'
     */
    _settings.dataType = settings.dataType || this.TEXT;

        /**
     * The url
     *
     * @private
     * @type String
     * @default undefined
     */
    _settings.url = settings.url || undefined;

    /**
     * The data
     *
     * @private
     * @type String
     * @default ''
     */
    _settings.data = settings.data || '';

    /**
     * True if it is async
     *
     * @private
     * @type Boolean
     * @default true
     */
    _settings.async = settings.async || true;

    /**
     * The method that will be called on success
     *
     * @private
     * @type Function
     * @default undefined
     */
    _settings.success = settings.success || undefined;

    /**
     * The method that will be called on error
     *
     * @private
     * @type Function
     * @default undefined
     */
    _settings.error = settings.error || undefined;

    /**
     * Executes an ajax call
     * @author Thodoris Tsiridis
     */
    this.execute = function () {

        var xmlhttp;
        var url  = _settings.url;
        var sendParams = '';
        var result;

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (_settings.method === this.POST) {
            sendParams = _settings.data;
        } else {
            url += (_settings.data !== '' ? '?' + _settings.data : '');
        }

        try {
            xmlhttp.open(_settings.method, url, _settings.async);
            xmlhttp.send(sendParams);
        } catch (error) {
            /*console.log('Error: FrameworkJS.Ajax:', error)*/;
            if (typeof _settings.error !== 'undefined') {
                _settings.error(error);
            }
        }

        /**
         * Triggered when there is a readyState change event
         * @author Thodoris Tsiridis
         */
        xmlhttp.onreadystatechange = function() {
            var response;

            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                if (typeof _settings.success !== 'undefined') {

                    if (_settings.dataType === 'xml') {
                        result = xmlhttp.responseXML;
                    }

                    if (_settings.dataType === 'json') {
                        result = JSON.parse(xmlhttp.responseText);
                    }

                    if (_settings.dataType === 'text') {
                        result = xmlhttp.responseText;
                    }

                    _settings.success(result, xmlhttp);

                }

            } else if (xmlhttp.status == 404) {

                if (typeof _settings.error !== 'undefined') {
                    _settings.error(xmlhttp);
                }

            }
        }
    };

    return this;

};
/**
 * Base Service
 *
 * @module 72lions
 * @class Service
 * @namespace FrameworkJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FrameworkJS.Service = function() {

    /**
     * The view id
     *
     * @type String
     * @default ''
     */
    this.id = '';

    /**
     * The url for the service to use
     *
     * @type String
     * @default ''
     */
    this.url = '';

    /**
     * The url for the service to use
     *
     * @type String
     * @default ''
     */
    this.method = 'GET';

    /**
     * The data type
     *
     * @type String
     * @default 'text'
     */
    this.dataType = 'text';

    /**
     * The data
     *
     * @type String
     * @default ''
     */
    this.data = '';

    /**
     * True if it is async
     *
     * @type Boolean
     * @default true
     */
    this.async = true;

    /**
     * Fetches the data
     * @author Thodoris Tsiridis
     */
    this.fetch = function() {

        var ajax = new FrameworkJS.Ajax({
            method: this.method,
            dataType: this.dataType,
            url: this.url,
            success: this.onSuccess,
            error: this.onError
        }).execute();

    };

    /**
     * Is triggered when the fetch is successfull
     *
     * @param {String || Object || XML} result The result of the fetch
     * @param {XMLHttpRequest} request The XMLHttpRequest
     * @author Thodoris Tsiridis
     */
    this.onSuccess = function(result, request) {
        /*console.log('success', result, request, this)*/;
    };

    /**
     * Is triggered when the fetch is not successfull
     * @param  {Object} error The error
     * @author Thodoris Tsiridis
     */
    this.onError = function(error) {
        /*console.log('error', error)*/;
    };

};
/**
 * The Utils class holds utilities functions
 *
 * @module 72lions
 * @class EventTarget
 * @namespace FrameworkJS
 * @author Mr.Doob
 * @author Thodoris Tsiridis
 * @version 1.1
 */
FrameworkJS.Utils = {

    /**
     * Checks if an object is an array
     * @param  {Object}  object The object that will be checked
     * @return {Boolean}
     */
    isArray : function(object) {

        var s = typeof object;

        if (s === 'object') {
            if (object) {
                if (object instanceof Array) {
                    s = true;
                } else {
                    s = false;
                }
            } else {
                s = false;
            }
        } else {
            s = false;
        }

        return s;
    }

};
/**
 * Event target is used as a mixin so that the classes can support dispatch events and add events commands
 *
 * @module 72lions
 * @class EventTarget
 * @namespace FrameworkJS
 * @author Mr.Doob
 * @author Thodoris Tsiridis
 * @version 1.1
 */
FrameworkJS.EventTarget = function () {
    /**
     * The object that will hold all the event listeners
     *
     * @private
     * @type Object
     */
    var listeners = {};

    /**
     * Registers an event
     *
     * @param {String} type The event type
     * @param {Function} listener The callback function
     * @param {Object} ctx The context that will be used for the calling the callback
     * @author Mr.Doob
     * @author Thodoris Tsiridis
     */
    this.bind = function ( type, listener, ctx ) {
        var obj = {callback: listener, context: ctx};

        if ( listeners[ type ] === undefined ) {
            listeners[ type ] = [];
        }

        if ( listeners[ type ].indexOf(obj) === - 1 ) {
            listeners[ type ].push(obj);
        }

    };

    /**
     * Dispatches an event
     *
     * @param {String} type The event type
     * @author Mr.Doob
     * @author Thodoris Tsiridis
     */
    this.trigger = function ( event ) {
        var events = listeners[ event.type ];

        if (typeof events !== 'undefined') {
            for ( var i = 0; i < events.length; i++ ) {
                events[i].callback.call( events[i].context, event );
            }
        }

    };

    /**
     * Removes an event
     *
     * @param {String} type The event type
     * @param {Function} listener The callback function
     * @param {Object} ctx The context that will be used for the calling the callback
     * @author Mr.Doob
     * @author Thodoris Tsiridis
     */
    this.unbind = function ( type, listener, ctx) {
        var index;
        var events = listeners[type];

        if (typeof events !== 'undefined') {
            for (var i = 0; i < events.length; i++) {
                if (events[i].callback === listener && events[i].context === ctx) {
                   index = i;
                   break;
                }
            }

            if ( index !== - 1 ) {
                listeners[ type ].splice( index, 1 );
            }
        }

    };

};
/**
 * Base Controller
 *
 * @module 72lions
 * @class Controller
 * @namespace FrameworkJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FrameworkJS.Controller = function() {

    FrameworkJS.EventTarget.call(this);

    /**
     * A reference to this controller's view
     *
     * @private
     * @type FRAMEWORKJS.View
     * @property _view
     * @default undefined
     */
    this._view = undefined;

    /**
     * A reference to this controller's model
     *
     * @private
     * @type FRAMEWORKJS.Model
     * @property _model
     * @default undefined
     */
    this._model = undefined;

    /**
     * The controller id
     *
     * @type String
     * @default ''
     */
     this.id = '';

    /**
     * The controller name
     *
     * @type String
     * @default ''
     */
    this.name = '';

    /**
     * Initializes the plugin
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.id The unique id for this class
     * @author Thodoris Tsiridis
     */
    this.initialize = function(attributes) {
        if (typeof attributes !== 'undefined') {
            this.id = attributes.id || '';
        }

        this.postInitialize();
    };

    /**
     * This function is executed right after the initialized function is called
     *
     * @param {Object} options The options that will be used to initialize the controller
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function() {};

    /**
     * Sets the view of the controller
     *
     * @param {seventytowlions.View.Base} view The new view
     * @author Thodoris Tsiridis
     */
    this.setView = function(view) {
        this._view = view;
        this._view.setController(this);
    };

    /**
     * Returns the view of the specific view
     *
     * @return {STL.View.Base} The Base view
     * @author Thodoris Tsiridis
     */
    this.getView = function() {
        return this._view;
    };

    /**
     * Returns the model of the specific model
     *
     * @return {STL.Model.Base} The Base model
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {
        return this._model;
    };

    /**
     * Sets the model of the controller
     *
     * @param {seventytowlions.Model.Base} model The new model
     * @author Thodoris Tsiridis
     */
    this.setModel = function(model) {
      this._model = model;
      this._model.unbind('change', this.onModelChange, this);
      this._model.bind('change', this.onModelChange, this);
    };

    /**
     * Triggered when a property of the model has changed
     *
     * @param  {Object} event The event
     * @author Thodoris Tsiridis
     */
    this.onModelChange = function (event) {

    };

    /**
     * This function is called by the Publisher
     *
     * @param  {Object} arguments The arguments that were send from the observable
     * @param {Object} arguments.message The message
     * @param {Object} arguments.params The parameters that were sent from the notifier
     * @author Thodoris Tsiridis
     */
    this.onNotify = function(arguments) {
    };

    /**
     * Subscribes on specific messages
     *
     * @param  {String} message The message that will subscribe to
     * @author Thodoris Tsiridis
     */
    this.subscribe = function(message) {
        FrameworkJS.Publisher.subscribe(message, this);
    };

    /**
     * Unsubscribes on specific messages
     *
     * @param  {String} message The message that will unsubscribe from
     * @author Thodoris Tsiridis
     */
    this.unsubscribe = function(message) {
        FrameworkJS.Publisher.unsubscribe(message, this);
    };

};
/**
 * Base View
 *
 * @module 72lions
 * @class View
 * @namespace FrameworkJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FrameworkJS.View = function() {

    FrameworkJS.EventTarget.call(this);

    /**
     * The view name
     *
     * @type String
     * @default ''
     */
    this.name = '';

    /**
     * The view id
     *
     * @type String
     * @default ''
     */
    this.id = '';

    /**
     * The section title
     * @type String
     * @default ''
     */
    this.title = '';

    /**
     * A reference to this view's controller
     *
     * @type FRAMEWORKJS.Controller
     * @default undefined
     */
    this._controller = undefined;

    /**
     * The DOM Element
     *
     * @type Object
     * @default null
     */
    this.domElement = null;

    /**
     * Function for when showing the view
     *
     * @author Thodoris Tsiridis
     */
    this.show = function() {};

    /**
     * Function for when hiding the view
     *
     * @author Thodoris Tsiridis
     */
    this.hide = function() {};

    /**
     * Sets the name of the view
     *
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the name of the view
     *
     * @param {String} name The name fo the view
     * @author Thodoris Tsiridis
     */
    this.setId = function(id) {
        this.id = id;
    };

    /**
     * Gets the model for the view
     *
     * @return {STL.Model.Base} The model
     * @author Thodoris Tsiridis
     */
    this.getModel = function() {

        if(this._controller){
            return this._controller.getModel();
        }

        return undefined;
    };

    /**
     * Sets the controller for the view
     *
     * @param {STL.Controller.Base} controller The controller
     * @author Thodoris Tsiridis
     */
    this.setController = function(controller) {
        this._controller = controller;
    };

    /**
     * Gets the controller for the view
     *
     * @return {STL.Controller.Base} The controller
     * @author Thodoris Tsiridis
     */
    this.getController = function() {
        return this._controller;
    };

    /**
     * Returns the main dom element of the view
     *
     * @return {Object} A DOM element
     * @author Thodoris Tsiridis
     */
    this.getDOMElement = function() {
        return this.domElement;
    };

    /**
     * Initializes the view
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.id The unique id for this class
     * @author Thodoris Tsiridis
     */
    this.initialize = function(attributes) {
        if (typeof attributes !== 'undefined') {
            this.setId(attributes.id);
        }
    };

};
/**
 * Base Model
 *
 * @module 72lions
 * @class Model
 * @namespace FrameworkJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FrameworkJS.Model = function(){

    FrameworkJS.EventTarget.call(this);

    /**
     * The object that holds the data
     *
     * @type String
     * @default {}
     */
    this.data = {};

    /**
     * The view name
     *
     * @type String
     * @default ''
     */
    this.name = '';

    /**
     * The view id
     *
     * @type String
     * @default ''
     */
    this.id = '';

    /**
     * Saves values to a specific key of the model
     *
     * @param {Object} properties The properties to change
     * @author Thodoris Tsiridis
     */
    this.set = function(properties) {
        var changed;
        var changedProperties;

        for(key in properties){

            changed = false;

            if (typeof this.data[key] !== 'undefined') {

                if (this.data[key] !== properties[key]) {
                    changed = true;
                }

            } else {
                changed = true;
            }

            this.data[key] = properties[key];

            if (changed) {
                if( typeof changedProperties === 'undefined') {
                    changedProperties = {};
                }
                this.trigger({type: 'change:' + key, value: properties[key]});
                changedProperties[key] = properties[key];
            }
        }

        if( typeof changedProperties !== 'undefined') {
            this.trigger({type: 'change', value: changedProperties});
        }

    };

    /**
     * Returns a value to a specific key of the model
     *
     * @param {String} key The key of the data object to be set
     * @return {Object || String || Number || Array} The value of the specific data key
     * @author Thodoris Tsiridis
     */
    this.get = function(key) {
        return this.data[key];
    };

};
