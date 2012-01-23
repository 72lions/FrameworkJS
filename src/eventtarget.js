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
    this.addEventListener = function ( type, listener, ctx ) {
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
    this.dispatchEvent = function ( event ) {
        var events = listeners[ event.type ];
        for ( var i = 0; i < events.length; i++ ) {
            events[i].callback.call( events[i].context, event );
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
    this.removeEventListener = function ( type, listener, ctx) {

        var events = listeners[type];

        for (var i = 0; i < events.length; i++) {
            if (events[i].callback === listener && events[i].context === ctx) {
               index = i;
               break;
            }
        }

        if ( index !== - 1 ) {
            listeners[ type ].splice( index, 1 );
        }

    };

};