var FrameworkJS = {

    /**
     * An object holding all the different models
     *
     * @private
     * @type Object
     */
    _models: {},

    /**
     * An object holding all the different views
     *
     * @private
     * @type Object
     */
    _views: {},

    /**
     * An object holding all the different controllers
     *
     * @private
     * @type Object
     */
    _controllers: {},

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
     * @return {FrameworkJS.Model || FrameworkJS.View || FrameworkJS.Controller}
     */
    extend: function (what, withWhat, classType) {

        if (typeof what !== 'undefined') {
            if (typeof what.prototype !== 'undefined') {
                if (typeof withWhat === 'function') {
                    what.prototype = new withWhat();
                    if (typeof FrameworkJS._types[classType] === 'undefined'){
                        FrameworkJS._types[classType] = what;
                    } else {
                        /*console.log('You are trying to register an object type that already exists... Nothing will happen')*/;
                    }
                    return what;
                } else {
                    /*console.log('FrameworkJS.extent: Invalid source object')*/;
                    return null;
                }
            } else {
                /*console.log('FrameworkJS.extent: Target object has no prototype')*/;
                return null;
            }
        } else {
            /*console.log('FrameworkJS.extent: Target object is null')*/;
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

        if (type === FrameworkJS.CONTROLLER) {

            var className, id, model, controllerObj;
            var exists = -1;

            className = classType || 'Generic.Controller';
            id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

            // Check if there is an array with objects of className type
            // If not then create a new array
            if(!FrameworkJS._controllers[id] || !FrameworkJS.Utils.isArray(FrameworkJS._controllers[id])) {
                FrameworkJS._controllers[id] = [];
            }

            // Loop through al the items in the array
            // to check if an item with this id already exists
            for (var i = FrameworkJS._controllers[id].length - 1; i >= 0; i--) {
                if(FrameworkJS._controllers[id][i].id == id){
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

                FrameworkJS._controllers[id].push(controllerObj);
                controllerObj.classType.id = id;
                return controllerObj.classType;

            } else {
                return FrameworkJS._controllers[id][exists].classType;
            }

        } else if (type === FrameworkJS.VIEW) {

            var viewObj, id, className;
            var exists = -1;

            className = classType || 'Generic.View';
            id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

            // Check if there is an array with objects of className type
            // If not then create a new array
            if(!FrameworkJS._views[className] || !FrameworkJS.Utils.isArray(FrameworkJS._views[className])) {
                FrameworkJS._views[className] = [];
            }

            // Loop through al the items in the array
            // to check if an item with this id already exists
            for (var i = FrameworkJS._views[className].length - 1; i >= 0; i--) {
                if(FrameworkJS._views[className][i].id == id){
                    exists = i;
                }
            }

            if(exists === -1){

                exists = null;

                // Check if the class that we want to load exists
                if(FrameworkJS._types[className] !== undefined){
                    viewObj = {id: id, classType: new FrameworkJS._types[className]()};
                } else {
                    viewObj = {id: id, classType: new FrameworkJS.View()};
                }

                FrameworkJS._views[className].push(viewObj);
                viewObj.classType.id = id;
                return viewObj.classType;

            } else {
                return FrameworkJS._views[className][exists].classType;
            }

        } else if( type === FrameworkJS.MODEL) {

            var exists = -1, modelObj, className;

            className = classType || 'Generic.Model';
            id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

            // Check if there is an array with objects of className type
            // If not then create a new array
            if(!FrameworkJS._models[className] || !FrameworkJS.Utils.isArray(FrameworkJS._models[className])) {
                FrameworkJS._models[className] = [];
            }

            // Loop through al the items in the array
            // to check if an item with this id already exists
            for (var i = FrameworkJS._models[className].length - 1; i >= 0; i--) {
                if(FrameworkJS._models[className][i].id == id){
                    exists = i;
                }
            }

            if(exists === -1){

                exists = null;

                // Check if the class that we want to load exists
                if(FrameworkJS._types[className] !== undefined){
                    modelObj = {id: id, classType: new  FrameworkJS._types[className]()};
                } else {
                    modelObj = {id: id, classType: new FrameworkJS.Model()};
                }

                FrameworkJS._models[className].push(modelObj);
                modelObj.classType.id = id;
                return modelObj.classType;

            } else {
                return FrameworkJS._models[className][exists].classType;
            }

        } else {

            /*console.log('FrameworkJS.retrieve: Not a valid class type', type)*/;
            return null;
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
    MODEL: 'model'

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
     * @param  {String} message The message that will be used for notifying the subscribers
     * @param {Object} args The arguments that will passed on the subscriber
     * @author Thodoris Tsiridis
     */
    this.notify = function(message, args) {
        subscribers = _subscribers[message];

        if (typeof subscribers !== 'undefined') {
            for (var i = 0; i < subscribers.length; i++) {
                if (typeof subscribers[i].onNotify !== 'undefined') {
                    subscribers[i].onNotify.call(subscribers[i], {message: message, params: args});
                }
            };
        }
    };

    return this;

}(window);
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
    this.removeEventListener = function ( type, listener, ctx) {
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
     * Saves a value to a specific key of the model
     *
     * @param {String} key The key of the data object to be set
     * @param {Object || String || Number || Array} value The value to save on the specific key
     * @author Thodoris Tsiridis
     */
    this.set = function(key, value) {
        this.data[key] = value;
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
