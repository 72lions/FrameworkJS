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

            console.log('FrameworkJS.retrieve: Not a valid class type', type);
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