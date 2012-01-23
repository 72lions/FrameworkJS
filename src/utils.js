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