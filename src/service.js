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

        FrameworkJS.Ajax({
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
        console.log('success', result, request, this);
    };

    /**
     * Is triggered when the fetch is not successfull
     * @param  {Object} error The error
     * @author Thodoris Tsiridis
     */
    this.onError = function(error) {
        console.log('error', error);
    };

};