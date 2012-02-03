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
FrameworkJS.Utils = (function(){
    /**
     * Stores all the templates that were loaded with an Ajax call so that they are not loaded again
     * @type {Array}
     */
    var _cachedTemplates = {};

    /**
     * Parses the template
     *
     * @param  {String} template A template or an id of an element
     * @param  {Object} data     An object that contains the data
     * @return {String}
     * @author Thodoris Tsiridis
     */
    var parseTmpl = function (template, data) {

        var i = 0, result = '', parsed = '', dataObject, re;

        if (FrameworkJS.Utils.isArray(data)) {

            for (; i < data.length; i++) {

                dataObject = data[i];

                if (typeof dataObject === 'object') {
                    parsed = template;
                    for(key in dataObject) {
                        re = new RegExp('\\${' + key + '}', 'g');
                        parsed = parsed.replace(re, dataObject[key]);
                    }
                    result += parsed;
                } else {
                    console.log('FrameworkJS.Utils.tmpl: Not a valid parameter data. Should be an object or an array of objects.');
                }
            }

        } else {

            if (typeof data === 'object') {

                    parsed = template;

                    for(key in data) {
                        re = new RegExp('\\${' + key + '}', 'g');
                        parsed = parsed.replace(re, data[key]);
                    }

                    result = parsed;

            } else {
                console.log('FrameworkJS.Utils.tmpl: Not a valid parameter data. Should be an object or an array of objects.');
            }

        }

        return result;

    };

    return {
        /**
         * Checks if an object is an array
         *
         * @param  {Object}  object The object that will be checked
         * @return {Boolean}
         */
         isArray: function(object) {

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
        },

        /**
         * Parses a template and replaces the keyworks with the data
         *
         * @param  {String} template A template or an id of an element
         * @param  {Object} data     An object that contains the data
         * @return {String}
         * @author Thodoris Tsiridis
         */
        tmpl: function (template, data) {
            var element, src;
            // Check if the template is a string
            if (typeof template === 'string') {
                // Check if the template is not an empty string
                if (template.length) {
                    // Check if the first template character is # which would mean that this is the id of an element
                    if (template[0] === '#') {
                        // Get the element id without the #
                        element = document.getElementById(template.slice(1));
                        // Check if the element is not null
                        if (element !== null){
                            src = element.getAttribute('src');
                            // Check if the element has a src attribute. iIf it does then we'll make an ajax call
                            if (src !== null) {
                                // Check the cache
                                if (typeof _cachedTemplates[template] !== 'undefined') {
                                    return parseTmpl.call(this, _cachedTemplates[template], data);
                                } else {

                                    var ajax = new FrameworkJS.Ajax({
                                        method: 'GET',
                                        dataType: 'text',
                                        url: src,
                                        async: false
                                    }).execute();

                                    _cachedTemplates[template] = ajax.responseText;
                                    return parseTmpl.call(this, ajax.responseText, data);
                                }

                            } else {
                                // Get the innerHTML of the script as the template
                                return parseTmpl.call(this, element.innerHTML, data);
                            }
                        } else {
                            console.log('FrameworkJS.Utils.tmpl: Not a valid template');
                        }
                    } else {
                        return parseTmpl.call(this, template, data);
                    }
                } else {
                    console.log('FrameworkJS.Utils.tmpl: Not a valid template');
                }
            } else {
                console.log('FrameworkJS.Utils.tmpl: Not a valid template');
            }

        }
    };

}());