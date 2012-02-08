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
     * @author Thodoris Tsiridis
     */
    this.initialize = function() {
    };

};