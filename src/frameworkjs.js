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

    /**
     * Extends a function
     * @param  {Function} what      The function that we want to extend
     * @param  {Function} withWhat  The class that we want to use for extending
     * @param  {String} classType The class type of the new extended function
     * @return {FRAMEWORKJS.Model || FRAMEWORKJS.View || FRAMEWORKJS.Controller}
     */
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

    /**
     * Returns a Model, View or Controller based on the class type and id. If there is no object initialized with that id and class type then one is created
     * @param  {String} id        The id of the class that we want to get
     * @param  {String} classType The class type of the object that we want to get
     * @param  {[type]} type      The type of the base class. e.x. 'model', 'view' or 'controller'
     * @return {FRAMEWORKJS.Model || FRAMEWORKJS.View || FRAMEWORKJS.Controller}
     * @author Thodoris Tsiridis
     */
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

        } else if( type === FRAMEWORKJS.MODEL) {

            var exists = -1, modelObj, className;

            className = classType || 'Generic.Model';
            id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

            // Check if there is an array with objects of className type
            // If not then create a new array
            if(!FRAMEWORKJS._models[className] || !FRAMEWORKJS.Utils.isArray(FRAMEWORKJS._models[className])) {
                FRAMEWORKJS._models[className] = [];
            }

            // Loop through al the items in the array
            // to check if an item with this id already exists
            for (var i = FRAMEWORKJS._models[className].length - 1; i >= 0; i--) {
                if(FRAMEWORKJS._models[className][i].id == id){
                    exists = i;
                }
            }

            if(exists === -1){

                exists = null;

                // Check if the class that we want to load exists
                if(FRAMEWORKJS.types[className] !== undefined){
                    modelObj = {id: id, classType: new  FRAMEWORKJS.types[className]()};
                } else {
                    modelObj = {id: id, classType: new FRAMEWORKJS.Model()};
                }

                FRAMEWORKJS._models[className].push(modelObj);
                modelObj.classType.setId(id);

                return modelObj.classType;

            } else {
                return FRAMEWORKJS._models[className][exists].classType;
            }

        } else {

            console.log('FRAMEWORKJS.retrieve: Not a valid class type', type);
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