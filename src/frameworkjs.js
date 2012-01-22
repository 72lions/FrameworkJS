var FRAMEWORKJS = {

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

    types: {},

    extend: function (what, withWhat, classType) {

        if (typeof what !== 'undefined') {
            if (typeof what.prototype !== 'undefined') {
                if (typeof withWhat === 'function') {
                    what.prototype = new withWhat();
                    if (typeof FRAMEWORKJS.types[classType] === 'undefined'){
                        FRAMEWORKJS.types[classType] = what;
                    } else {
                        console.log('You are trying to register an object type that already exists... Nothing will happen');
                    }
                    return what;
                } else {
                    console.log('FRAMEWORKJS.extent: Invalid source object');
                    return null;
                }
            } else {
                console.log('FRAMEWORKJS.extent: Target object has no prototype');
                return null;
            }
        } else {
            console.log('FRAMEWORKJS.extent: Target object is null');
            return null;
        }
    },

    retrieve: function (id, classType, type) {

        if (type === FRAMEWORKJS.CONTROLLER) {

            var className, id, model, controllerObj;
            var exists = -1;

            className = classType || 'Generic.Controller';
            id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

            // Check if there is an array with objects of className type
            // If not then create a new array
            if(!FRAMEWORKJS._controllers[id] || !FRAMEWORKJS.Utils.isArray(FRAMEWORKJS._controllers[id])) {
                FRAMEWORKJS._controllers[id] = [];
            }

            // Loop through al the items in the array
            // to check if an item with this id already exists
            for (var i = FRAMEWORKJS._controllers[id].length - 1; i >= 0; i--) {
                if(FRAMEWORKJS._controllers[id][i].id == id){
                    exists = i;
                    break;
                }
            }

            if(exists === -1){
                // Check if the class that we want to load exists
                if(FRAMEWORKJS.types[className] !== undefined){
                    controllerObj = {id: id, classType: new FRAMEWORKJS.types[className]()};
                } else {
                    // Create a generic controller
                    controllerObj = {id: id, classType: new FRAMEWORKJS.Controller()};
                }

                FRAMEWORKJS._controllers[id].push(controllerObj);
                controllerObj.classType.initialize({id: id});
                return controllerObj.classType;

            } else {
                return FRAMEWORKJS._controllers[id][exists].classType;
            }

        } else if (type === FRAMEWORKJS.VIEW) {

            var viewObj, id, className;
            var exists = -1;

            className = classType || 'Generic.View';
            id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

            // Check if there is an array with objects of className type
            // If not then create a new array
            if(!FRAMEWORKJS._views[className] || !FRAMEWORKJS.Utils.isArray(FRAMEWORKJS._views[className])) {
                FRAMEWORKJS._views[className] = [];
            }

            // Loop through al the items in the array
            // to check if an item with this id already exists
            for (var i = FRAMEWORKJS._views[className].length - 1; i >= 0; i--) {
                if(FRAMEWORKJS._views[className][i].id == id){
                    exists = i;
                }
            }

            if(exists === -1){

                exists = null;

                // Check if the class that we want to load exists
                if(FRAMEWORKJS.types[className] !== undefined){
                    viewObj = {id: id, classType: new FRAMEWORKJS.types[className]()};
                } else {
                    viewObj = {id: id, classType: new FRAMEWORKJS.View()};
                }

                FRAMEWORKJS._views[className].push(viewObj);
                viewObj.classType.preInitialize({id: id});
                return viewObj.classType;

            } else {
                return FRAMEWORKJS._views[className][exists].classType;
            }

        } else if( classType === FRAMEWORKJS.MODEL) {
            return 'Model';
        } else {
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
 * The Utils object holds some utility functions
 * @author Thodoris Tsiridis
 */
FRAMEWORKJS.Utils = {

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
 * @author Mr.Doob
 * @version 1.0
 */
FRAMEWORKJS.EventTarget = function () {
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
     */
    this.addEventListener = function ( type, listener, ctx ) {
        var obj = {callback: listener, context: ctx};

        if ( listeners[ type ] === undefined ) {
            listeners[ type ] = [];
        }

        if ( listeners[ type ].indexOf(ctx) === - 1 ) {
            listeners[ type ].push(ctx);
        }

    };

    /**
     * Dispatches an event
     *
     * @param {String} type The event type
     * @author Mr.Doob
     */
    this.dispatchEvent = function ( event ) {
        for ( var listener in listeners[ event.type ] ) {
            listener.callback.call( listener.context, event );
        }

    };

    /**
     * Removes an event
     *
     * @param {String} type The event type
     * @param {Function} listener The callback function
     * @param {Object} ctx The context that will be used for the calling the callback
     * @author Mr.Doob
     */
    this.removeEventListener = function ( type, listener, ctx) {
        var obj = {callback: listener, context: ctx};
        var index = listeners[ type ].indexOf( obj );

        if ( index !== - 1 ) {
            listeners[ type ].splice( index, 1 );
        }

    };

};

/**
 * Base Controller
 *
 * @module 72lions
 * @class Controller
 * @namespace FRAMEWORKJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FRAMEWORKJS.Controller = function() {

    FRAMEWORKJS.EventTarget.call(this);

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
    };

    /**
     * This function is executed right after the initialized function is called
     *
     * @param {Object} options The options that will be used to initialize the controller
     * @author Thodoris Tsiridis
     */
    this.postInitialize = function(options) {};

    /**
     * Sets the view of the controller
     *
     * @param {seventytowlions.View.Base} view The new view
     * @author Thodoris Tsiridis
     */
    this.setView = function(view) {
        this._view = view;
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

};

/**
 * Base View
 *
 * @module 72lions
 * @class View
 * @namespace FRAMEWORKJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FRAMEWORKJS.View = function() {

    FRAMEWORKJS.EventTarget.call(this);

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
     * A reference to this view's model
     *
     * @type FRAMEWORKJS.View
     * @default undefined
     */
    this._model = undefined;

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
     * Is triggered before initialization of the view
     *
     * @param {Object} attributes The attributes that will be used to initialize the class
     * @param {String} attributes.id The unique id for this class
     * @author Thodoris Tsiridis
     */
    this.preInitialize = function(attributes) {
        if (typeof attributes !== 'undefined') {
            this.setId(attributes.id);
        }

        this.initialize();
        this.draw();
        this.postDraw();
    };

    /**
     * Initializes the view
     *
     * @author Thodoris Tsiridis
     */
    this.initialize = function(){};

    /**
     * Draws the view
     *
     * @author Thodoris Tsiridis
     */
    this.draw = function(){};

    /**
     * Executed after the drawing of the view
     *
     * @author Thodoris Tsiridis
     */
    this.postDraw = function(){};

};

/**
 * Base Model
 *
 * @module 72lions
 * @class Model
 * @namespace FRAMEWORKJS
 * @author Thodoris Tsiridis
 * @version 1.0
 */
FRAMEWORKJS.Model = function(){

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
     * Sets the model data
     *
     * @param {Object} data The model data
     * @author Thodoris Tsiridis
     */
    this.setData = function(data) {
        this.data = data;
    };

    /**
     * Gets the model data
     *
     * @return {Object} The data
     * @author Thodoris Tsiridis
     */
    this.getData = function() {
        return this.data;
    };

    /**
     * Sets the name of the model
     *
     * @param {String} name The name/type of the model
     * @author Thodoris Tsiridis
     */
    this.setName = function(name) {
        this.name = name;
    };

    /**
     * Sets the id of the model
     *
     * @param {String} id The id of the model
     * @author Thodoris Tsiridis
     */
    this.setId = function (id) {
        this.id = id;
    };

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

