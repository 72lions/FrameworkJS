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
FrameworkJS.Utils = (function(){

    return {
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

}());