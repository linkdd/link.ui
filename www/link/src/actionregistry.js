define([
    'classify',
    'jquery'
], function(classify, $) {
    /**
     * Manage actions loading and calling.
     *
     * @class ActionRegistry
     * @main Link
     */
    classify.module('ActionRegistry', function() {
        var actions = {},
            promises = {};

        /**
         * Add a new action to the registry.
         *
         * @method add
         * @static
         * @param {string} name - Action's name.
         * @param {string or function} action - Action or module URL.
         */
        classify.def('add', function(name, action) {
            if (actions[name] === undefined) {
                if (typeof (action) === 'string') {
                    promises[name] = new Promise(function(resolve, reject) {
                        require(action, function(action) {
                            actions[name] = action;
                            resolve();
                        });
                    });
                }
                else {
                    actions['name'] = action;
                }
            }
        });

        /**
         * Used to ensure that every registered action has been loaded.
         *
         * @method ready
         * @static
         * @return {Promise} Promise resolved when all actions are loaded.
         */
        classify.def('ready', function() {
            var p = [];

            for(var name in promises) {
                p.push(promises[name]);
            }

            return $.when(p);
        });

        /**
         * Utility to call actions.
         *
         * @method call
         * @static
         * @param {string} name - Action's name.
         * @param {array} args - Action's arguments.
         */
        classify.def('call', function(name, args) {
            actions[name].apply(action, args);
        });
    });

    return ActionRegistry;
});
