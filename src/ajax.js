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
     * The object that holds all the settings
     *
     * @private
     * @type Object
     * @default {}
     */
    var _settings = {};

    settings = settings || {};

    /**
     * The method type
     *
     * @private
     * @type String
     * @default 'GET'
     */
    _settings.method = settings.method || 'GET';

    /**
     * The data type
     *
     * @private
     * @type String
     * @default 'text'
     */
    _settings.dataType = settings.dataType || 'text';

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
    _settings.async = typeof settings.async !== 'undefined' ? settings.async : true;

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
    return {

        /**
         * The constant for the post method type
         *
         * @type String
         * @default 'POST'
         */
        POST: 'POST',

        /**
         * The constant for the get method type
         *
         * @type String
         * @default 'GET'
         */
        GET: 'GET',

        /**
         * The constant for the json data type
         *
         * @type String
         * @default 'json'
         */
        JSON: 'json',

        /**
         * The constant for the xml data type
         *
         * @type String
         * @default 'xml'
         */
        XML: 'xml',

        /**
         * The constant for the text data type
         *
         * @type String
         * @default 'text'
         */
        TEXT: 'text',

        /**
         * Executes an Ajax call
         * @author Thodoris Tsiridis
         */
        execute: function () {

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
                console.log('Error: FrameworkJS.Ajax:', error);
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
            };

            return xmlhttp;
        }

    };

};