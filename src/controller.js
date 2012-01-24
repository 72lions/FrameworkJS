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
     * This function is called when
     *
     * @param  {Object} args The arguments that were send from the observable
     * @author Thodoris Tsiridis
     */
    this.onNotify = function(args) {
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