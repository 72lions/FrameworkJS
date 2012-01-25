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
            var index;

            if (typeof message !== 'undefined' && typeof subscriber !== 'undefined') {
                if (typeof _subscribers[message] !== 'undefined') {
                    index = _subscribers[message].indexOf(subscriber);
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
                        if (typeof subscribers[i].onNotify !== 'undefined') {
                            subscribers[i].onNotify.call(subscribers[i], {message: message, params: args || {} });
                        }
                    };
                } else {
                    console.log('Warning: FrameworkJS.Publisher.notify: There are no subscribers for that message');
                }
            } else {
                console.log('FrameworkJS.Publisher.notify: You must provide a message');
            }
        }

    }

}) ();