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

    /**
     * Sorts an array based on the priority key
     *
     * @private
     * @author Thodoris Tsiridis
     */
    var sortByPriority = function(a, b){
        var x = parseInt(a.priority, 0);
        var y = parseInt(b.priority, 0);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    };

    return {


        /**
         * Registers a subscriber
         *
         * @param  {String} message    The message on which it will register the subscriber
         * @param  {Function} subscriber The subscriber
         * @param {Number} priority The priority of the callback function
         * @author Thodoris Tsiridis
         */
        subscribe: function(message, subscriber, priority) {
            var alreadyRegistered = false, subscribers;

            priority = priority || 0;

            if (typeof message !== 'undefined' && typeof subscriber !== 'undefined') {

                if (typeof _subscribers[message] === 'undefined') {
                    _subscribers[message] = [];
                }

                subscribers = _subscribers[message];

                for (var i = subscribers.length - 1; i >= 0; i--) {
                    if (subscribers[i].subscriber === subscriber){
                        alreadyRegistered = true;
                        break;
                    }
                }

                if (!alreadyRegistered) {
                    _subscribers[message].push({subscriber: subscriber, priority: priority});
                    _subscribers[message].sort(sortByPriority);
                }

            } else {
                console.log('FrameworkJS.Publisher.subscribe: You must provide a message and a subscriber');
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
            var index = -1, subscribers;

            if (typeof message !== 'undefined' && typeof subscriber !== 'undefined') {
                if (typeof _subscribers[message] !== 'undefined') {
                    subscribers = _subscribers[message];
                    for (var i = subscribers.length - 1; i >= 0; i--) {
                        if (subscribers[i].subscriber === subscriber){
                            index = i;
                            break;
                        }
                    }
                    if ( index !== -1) {
                        _subscribers[message].splice(index, 1);
                    }
                } else {
                    console.log('Warning: FrameworkJS.Publisher.unsubscribe: There are no subscribers for that message');
                }
            } else {
                console.log('FrameworkJS.Publisher.unsubscribe: You must provide a message and a subscriber');
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
                        if (typeof subscribers[i].subscriber.onNotify !== 'undefined') {
                            subscribers[i].subscriber.onNotify.call(subscribers[i].subscriber, {message: message, params: args || {} });
                        }
                    }
                } else {
                    //console.log('Warning: FrameworkJS.Publisher.notify: There are no subscribers for that message');
                }
            } else {
                console.log('FrameworkJS.Publisher.notify: You must provide a message');
            }
        }

    };

}());