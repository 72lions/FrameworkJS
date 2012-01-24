/**
 * The Publisher
 *
 * @module 72lions
 * @class Publisher
 * @namespace FrameworkJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FrameworkJS.Publisher = function(global) {

    /**
     * The object that holds all the subscribers
     *
     * @private
     * @type Object
     * @default {}
     */
    var _subscribers = {};

    /**
     * Registers a subscriber
     *
     * @param  {String} message    The message on which it will register the subscriber
     * @param  {Function} subscriber The subscriber
     * @author Thodoris Tsiridis
     */
    this.subscribe = function(message, subscriber) {

        if (typeof _subscribers[message] === 'undefined') {
            _subscribers[message] = [];
        }

        if (_subscribers[message].indexOf(subscriber) === -1) {
            _subscribers[message].push(subscriber);
        }

    };

    /**
     * Registers a subscriber
     *
     * @param  {String} message    The message on which it will register the subscriber
     * @param  {Function} subscriber The subscriber
     * @author Thodoris Tsiridis
     */
    this.unsubscribe = function(message, subscriber) {
        var index;

        if (typeof _subscribers[message] !== 'undefined') {
            index = _subscribers[message].indexOf(subscriber);
            if ( index !== -1) {
                _subscribers[message].splice(index, 1);
            }
        }
    };

    /**
     * It will notify all the registered subscribers
     *
     * @param  {[type]} message The message that will be used for notifying the subscribers
     * @param {Object} args The arguments that will passed on the subscriber
     * @author Thodoris Tsiridis
     */
    this.notify = function(message, args) {
        subscribers = _subscribers[message];

        if (typeof subscribers !== 'undefined') {
            for (var i = 0; i < subscribers.length; i++) {
                if (typeof subscribers[i].onNotify !== 'undefined') {
                    subscribers[i].onNotify.call(subscribers[i], args);
                }
            };
        }
    };

    return this;

}(window);