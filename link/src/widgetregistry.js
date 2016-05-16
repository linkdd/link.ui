define([
    'classify',
    'jquery'
], function(classify, $) {
    /**
     * Manage widgets loading and instantiation.
     *
     * @class WidgetRegistry
     * @main Link
     */
    classify.module('WidgetRegistry', function() {
        var widgets = {},
            promises = {};

        /**
         * Add a new widget class to the registry.
         *
         * @method add
         * @static
         * @param {string} name - Widget's name.
         * @param {string or Widget} widget - Widget class or module URL.
         */
        classify.def('add', function(name, widget) {
            if (widgets[name] === undefined) {
                if (typeof (widget) === 'string') {
                    promises[name] = new Promise(function(resolve, reject) {
                        require(widget, function(widgetcls) {
                            widgets[name] = widgetcls;
                            resolve();
                        });
                    });
                }
                else {
                    widgets[name] = widget;
                }
            }
        });

        /**
         * Used to ensure that every registered widget has been loaded.
         *
         * @method ready
         * @static
         * @return {Promise} Promise resolved when all widgets are loaded.
         */
        classify.def('ready', function() {
            var p = [];

            for(var name in promises) {
                p.push(promises[name]);
            }

            return $.when(p);
        });

        /**
         * Utility to create new widgets.
         *
         * @method create
         * @static
         * @param {object} config - Widget's configuration
         * @return {Widget} A new widget.
         */
        classify.def('create', function(config) {
            if (widgets[config.xtype] === undefined) {
                throw new Error('Unknown widget: ' + config.xtype);
            }
            return new widgets[config.xtype](config);
        });
    });

    return WidgetRegistry;
});
