var FrameworkJS = {

    /**
     * An object holding all the different classes
     *
     * @private
     * @type Object
     */
    _classes: {},

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
     * @return {FrameworkJS.Model || FrameworkJS.View || FrameworkJS.Controller || FrameworkJS.Service}
     */
    extend: function (what, withWhat, classType) {

        if (typeof what !== 'undefined') {
            if (typeof what.prototype !== 'undefined') {
                if (typeof withWhat === 'function') {
                    what.prototype = new withWhat();
                    if (typeof FrameworkJS._types[classType] === 'undefined'){
                        FrameworkJS._types[classType] = what;
                    } else {
                        console.log('FrameworkJS.extend: You are trying to register an object type that already exists... Nothing will happen');
                    }
                    return what;
                } else {
                    console.log('FrameworkJS.extend: Invalid source object');
                    return null;
                }
            } else {
                console.log('FrameworkJS.extend: Target object has no prototype');
                return null;
            }
        } else {
            console.log('FrameworkJS.extend: Target object is null');
            return null;
        }
    },

    /**
     * Returns a Model, View or Controller based on the class type and id. If there is no object initialized with that id and class type then one is created
     * @param  {String} id        The id of the class that we want to get
     * @param  {String} classType The class type of the object that we want to get
     * @param  {[type]} type      The type of the base class. e.x. 'model', 'view', 'controller' or 'service'
     * @return {FrameworkJS.Model || FrameworkJS.View || FrameworkJS.Controller || FrameworkJS.Service}
     * @author Thodoris Tsiridis
     */
    retrieve: function (id, classType, type) {

        var className, id, model, controllerObj;
        var exists = -1;

        className = classType || 'Generic.Controller';
        id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

        // Check if there is an array with objects of className type
        // If not then create a new array
        if(!FrameworkJS._classes[className] || !FrameworkJS.Utils.isArray(FrameworkJS._classes[className])) {
            FrameworkJS._classes[className] = [];
        }

        // Loop through al the items in the array
        // to check if an item with this id already exists
        for (var i = FrameworkJS._classes[className].length - 1; i >= 0; i--) {
            if(FrameworkJS._classes[className][i].id == id){
                exists = i;
                return FrameworkJS._classes[className][exists].classType;
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

            FrameworkJS._classes[className].push(controllerObj);
            controllerObj.classType.id = id;
            return controllerObj.classType;

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
    MODEL: 'model',

    /**
     * A service constant
     *
     *@type String
     * @property SERVICE
     * @default 'service'
     */
    SERVICE: 'service'

};