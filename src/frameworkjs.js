var FrameworkJS = (function(){

    /**
     * An object holding all the different classes
     *
     * @private
     * @type Object
     */
    var _classes= {};

    /**
     * An object holding all the different class _types
     *
     * @private
     * @type Object
     */
    var _types= {};

    return {
        /**
         * Extends a function
         *
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
                        what.prototype.constructor = what;
                        if (typeof _types[classType] === 'undefined'){
                            _types[classType] = what;
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
         *
         * @param  {String} id        The id of the class that we want to get
         * @param  {String} classType The class type of the object that we want to get
         * @return {FrameworkJS.Model || FrameworkJS.View || FrameworkJS.Controller || FrameworkJS.Service}
         * @author Thodoris Tsiridis
         */
        retrieve: function (id, classType) {

            var className, model, controllerObj;
            var exists = -1;

            // Check if the classType is not undefined
            if (typeof classType !== 'undefined') {
                className = classType;
            } else {
                console.log('FrameworkJS.retrieve: No class type was provided');
                return null;
            }

            id = id || ('_id_' + Math.floor(Math.random()*10000).toString());

            // Check if there is an array with objects of className type
            // If not then create a new array
            if(!_classes[className] || !FrameworkJS.Utils.isArray(_classes[className])) {
                _classes[className] = [];
            }

            // Loop through al the items in the array
            // to check if an item with this id already exists
            for (var i = _classes[className].length - 1; i >= 0; i--) {
                if(_classes[className][i].id == id){
                    exists = i;
                    return _classes[className][exists].classType;
                }
            }

            if(exists === -1){
                // Check if the class that we want to load exists
                if(_types[className] !== undefined){
                    controllerObj = {id: id, classType: new _types[className]()};
                } else {
                    // Create a generic controller
                    controllerObj = {id: id, classType: new FrameworkJS.Controller()};
                }

                _classes[className].push(controllerObj);
                controllerObj.classType.id = id;
                return controllerObj.classType;

            }
        },

        /**
         * Returns a a class definition
         *
         * @param  {String} classType The class type of the object that we want to get
         * @return {Funtion}
         * @author Thodoris Tsiridis
         */
        getClass: function(classType) {
            if (typeof _types[classType] !== 'undefined')  {
                return _types[classType];
            } else {
                console.log('FrameworkJS.getClass: Class type ' + classType + ' does not exist');
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
        MODEL: 'model',

        /**
         * A service constant
         *
         *@type String
         * @property SERVICE
         * @default 'service'
         */
        SERVICE: 'service'
    }
}());