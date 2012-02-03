/**
 * Routing manager is responsible for listening to popstates in order to dispatch events. Clients can register their interest on these events
 *
 * @module 72lions
 * @class Router
 * @namespace FrameworkJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FrameworkJS.Router = (function(){

    /**
     * It is set to true the first time we get a popstate
     *
     * @private
     * @type Boolean
     * @default true
     */
    var isRefresh = true;

    /**
     * It holds all the registered events for the pop and push
     *
     * @private
     * @type Object
     * @default { push: [], pop: []}
     */
    var registeredMembers = { push: [], pop: []};

    /**
     * It holds all the registered events for the path changes
     *
     * @private
     * @type Object
     * @default {}
     */
    var registeredPathMembers = {};

    /**
     * It holds the current state
     *
     * @private
     * @type Object
     * @default null
     */
    var currentState = null;

    /**
     * Holds the intervalId for the setInterval function if the History API isn't supported and hashes are used instead
     *
     * @private
     * @type Number
     * @default null
     */
    var hashChangeIntervalId = null;

    /**
     * The current hash
     *
     * @private
     * @type String
     * @default ''
     */
    var currentHash = '';

    /**
     * It is true if the History API is supported
     *
     * @private
     * @type Boolean
     * @default true
     */
    var isHistoryAPISupported = true;

    /**
     * The base path
     *
     * @type String
     * @private
     * @default ''
     */
    var basePath = '';

    /**
     * After how many milliseconds the app will listen for a hash change
     *
     * @type Number
     * @private
     * @default 500
     */
    var hashListenInterval = 500;

    /**
     * This is function is triggered on a window popstate
     *
     * @private
     * @param {Object} e The object returned from the event
     * @author Thodoris Tsiridis
     */
    var onPopstate = function(e) {

        //Get the state
        currentState = FrameworkJS.Router.getState();

        // If the popstate runs again then it will not be a refresh but a push
        // Only the first time of a pop state we know for sure that it is a refresh
        if(isRefresh){
            isRefresh = false;
        }

        //Notify all the members that there was a pop state
        notifyRegisteredMembers('pop');

        // If History API is supported then push the path
        if(isHistoryAPISupported){
            notifyRegisteredPathChangeMembers(currentState.path);
        } else {
            // Else push the hash
            notifyRegisteredPathChangeMembers(currentState.hash);
        }
    };

    /**
     * Gets the current state by reading the URL
     *
     * @private
     * @return {Object} Returns an object with the following keys
     * @author Thodoris Tsiridis
     */
    var getAPIState = function(){

        var tempState = parseURL(location.href);
        tempState.isRefresh = isRefresh;

        return tempState;
    };

    /**
     * Notifies all the registered members
     *
     * @private
     * @param {String} eventType The name of the event e.x. push, pop
     * @author Thodoris Tsiridis
     */
    var notifyRegisteredMembers = function(eventType) {

        FrameworkJS.Publisher.notify('router:' + eventType, {state: currentState});
        return;

    };

    /**
     * Notifies all the registered members when a path change happens
     *
     * @private
     * @param {String} path The path e.x. segment1/segment2
     * @author Thodoris Tsiridis
     */
    var notifyRegisteredPathChangeMembers = function(path){

        FrameworkJS.Publisher.notify('router:path:' + path, {state: currentState});
        return;
    };

    /**
     * Performs a check to see if the hash has changed and triggers then onPopstate function
     *
     * @private
     * @author Thodoris Tsiridis
     */
    var checkHashChange = function(){
        var hash = FrameworkJS.Router.getState().hash;

        if (currentHash !== hash) {
            currentHash = hash;
            onPopstate(null);
            return;
        }

    };

    /**
     * Parses a url and returns an object containing the folowing data (if found): protocol, domain, post, path and path segments, hash and hash segments, query string and an object containing a key/value pair representation of the query
     *
     * @private
     * @param {String} url The url that we need to parse
     * @return {Object} The object containing the different segments from the parsed URL
     * @author Justin Windle
     */
    var parseURL = function( url ) {

        url = unescape( url );

        // remove protocol, domain and port
        var cut = url.replace( /^(http(s)?:\/\/)?[^\/]+\/?/i, '' );

        // try to match patterns for the data we need
        var parse = {

            protocol: url.match( /^(http(s)?):\/\//i ),
            domain: url.match( /^(http(s)?:\/\/)?([^\/:]+)/i ),
            query: url.match( /\?([\w\+\-\=&]+)/ ),
            port: url.match( /\w:(\d{1,5})/ ),
            hash: url.match( /#([\w\-\/]+)/ ),
            path: cut.match( /^\/?([\w\-\/\.]+)/ )

        };

        // Create a result form any matches returned
        var result = {

            protocol: parse.protocol ? parse.protocol[1] : null,
            domain: parse.domain ? parse.domain[3] : null,
            query: parse.query ? parse.query[1] : null,
            port: parse.port ? parse.port[1] : null,
            hash: parse.hash ? parse.hash[1] : null,
            path: parse.path ? parse.path[1] : null,
             url: url /* return the unescaped url */

        };

        // Split the path into segments
        if( result.path ) {
            result.pathSegments = result.path.replace( /^\/|\/$/g, '' ).split( '/' );
        }

        // Split the hash into segments
        if( result.hash ) {
            result.hashSegments = result.hash.replace( /^\/|\/$/g, '' ).split( '/' );
        }

        // Parse the query parameters
        if( result.query ) {

            result.params = {};

            var regex = /([\w\+\-]+)\=([\w\+\-]+)/g;
            var param = regex.exec( result.query );

            while( param ) {
                result.params[ param[1] ] = param[2];
                param = regex.exec( result.query );
            }

        }

        return result;
    };

    /**
     * Checks if the history API is supported
     *
     * @private
     * @return {Boolean} True if the history api is supported
     * @author Thodoris Tsiridis
     */
    var supportsHistoryAPI = function(){
        return !!(window.history && history.pushState);
    };

    /**
     * Checks if the onhashchange is supported
     *
     * @private
     * @return {Boolean} True if hash change event is supported
     * @author Thodoris Tsiridis
     */
    var supportsHashChange = function(){
        return "onhashchange" in window;
    };


    return {

        /**
         * Initalizes the utility
         *
         * @private
         * @author Thodoris Tsiridis
         */
        init: function(){

            // Check if the browser supports the History API
            if(supportsHistoryAPI()){

                window.onpopstate = onPopstate;

            } else {

                // Use hashes instead
                isHistoryAPISupported = false;

                if(supportsHashChange()){
                    window.onhashchange = onPopstate;

                } else {
                    // Listen for changes at specific intervals
                    hashChangeIntervalId = setInterval(function(){
                        checkHashChange();
                    }, hashListenInterval);

                }
            }
        },
        /**
         * Pushes a new state on the history api
         *
         * @public
         * @param {Ojbect} state The state; could be a JSON object that is passed on the popstate
         * @param {String} title The title of the page. Most browsers don't use it yet
         * @param {String} url The url that we need to push
         * @author Thodoris Tsiridis
         */
        push: function(state, title, url){

            if(isHistoryAPISupported){

                history.pushState(state, title, basePath + url);

            } else {

                location.href = basePath + '#' + url;
            }

            //Get the state
            currentState = FrameworkJS.Router.getState();

            //Notify all the members that there was a push event
            notifyRegisteredMembers('push');

            // If History API is supported then push the path
            if(isHistoryAPISupported){
                notifyRegisteredPathChangeMembers(currentState.path);
            } else {
                // Else push the hash
                notifyRegisteredPathChangeMembers(currentState.hash);
            }

        },

        /**
         * Replaces the current state with a new state
         *
         * @public
         * @param {Ojbect} state The state could be a JSON object that is passed on the popstate
         * @param {String} title The title of the page. Most browsers don't use it yet
         * @param {String} url The url that we need to push
         * @author Thodoris Tsiridis
         */
        replace: function(state, title, url){

            if(isHistoryAPISupported){

                history.replaceState(state, title, basePath + url);

            }

            //Get the state
            currentState = FrameworkJS.Router.getState();

            //Notify all the members that there was a push event
            notifyRegisteredMembers('push');

            // If History API is supported then push the path
            if(isHistoryAPISupported){
                notifyRegisteredPathChangeMembers(currentState.path);
            } else {
                // Else push the hash
                notifyRegisteredPathChangeMembers(currentState.hash);
            }

        },

        /**
         * It goes back in history
         *
         * @public
         * @param {Integer} steps The number of steps that you want to go backwards
         * @author Thodoris Tsiridis
         */
        goBack: function(steps){
            history.go(0 - (steps === null || steps === undefined ? 1 : steps));
        },

        /**
         * It goes forward in history
         *
         * @public
         * @param {Integer} steps The number of steps that you want to go forward
         * @author Thodoris Tsiridis
         */
        goForward: function(steps){
            history.go(steps === null || steps === undefined ? 1 : steps);
        },

        /**
         * It returns the state of the object
         *
         * @public
         * @return {Object}
         * @author Thodoris Tsiridis
         */
        getState: function(){
            return getAPIState();
        },

        /**
         * Sets the basepath
         * @param {String} path The path to be used as the basepath
         */
        setBasePath: function (path) {
            basePath = path;
        }
    };

}());

// Initializing the Router
FrameworkJS.Router.init();