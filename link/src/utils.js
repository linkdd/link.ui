define([
    'classify'
], function(classify) {
    /**
     * Link utilities module.
     *
     * @class Utils
     * @main Link
     */
    classify.module('Utils', function() {
        var currentId = 0,
            currentIdByPrefix = {};

        /**
         * Generate new unique ID.
         *
         * @method generateId
         * @static
         * @param {string} prefix - optional prefix for generated ID.
         * @return {string} unique ID.
         */
        classify.def('generateId', function(prefix) {
            var result = undefined;

            if (prefix === undefined) {
                result = 'id-' + currentId;
                currentId++;
            }
            else {
                if (currentIdByPrefix[prefix] === undefined) {
                    currentIdByPrefix[prefix] = 0;
                }

                result = prefix + '-id-' + currentIdByPrefix[prefix];
                currentIdByPrefix[prefix]++;
            }

            return result;
        });
    });

    return Utils;
});
