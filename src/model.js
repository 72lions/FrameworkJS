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

    FrameworkJS.EventTarget.call(this);

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
     * Saves values to a specific key of the model
     *
     * @param {Object} properties The properties to change
     * @author Thodoris Tsiridis
     */
    this.set = function(properties) {
        var changed;
        var changedProperties;

        for(key in properties){

            changed = false;

            if (typeof this.data[key] !== 'undefined') {

                if (this.data[key] !== properties[key]) {
                    changed = true;
                }

            } else {
                changed = true;
            }

            this.data[key] = properties[key];

            if (changed) {
                if( typeof changedProperties === 'undefined') {
                    changedProperties = {};
                }
                this.trigger({type: 'change:' + key, value: properties[key]});
                changedProperties[key] = properties[key];
            }
        }

        if( typeof changedProperties !== 'undefined') {
            this.trigger({type: 'change', value: changedProperties});
        }

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