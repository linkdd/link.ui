define([
    'classify',
    'jquery',
    'link/utils',
    'link/widgetregistry'
], function(classify, $, Utils, WidgetRegistry) {
    /**
     * Used to manage widget rendering
     *
     * @class View
     * @main Link
     */
    classify.classify('View', function() {
        /**
         * @class View
         * @constructor
         * @param {object} config - View configuration.
         */
        classify.def('initialize', function(config) {
            this.config = config || {};
            this.widget = WidgetRegistry.create(this.config.widget || {});

            this.container = $('<div/>', {
                id: Utils.generateId('link-view')
            });
        });

        /**
         * Create new widget with model.
         *
         * @method render
         * @param {object} model - Data to render in widget.
         * @return {Promise} Promise resolved when DOM element is generated.
         */
        classify.def('render', function(model) {
            var container = this.container,
                widget = this.widget;

            return new Promise(function(resolve, reject) {
                widget.render(model).then(function() {
                    if (container.has(widget.container).length === 0) {
                        container.append(widget.container);
                    }

                    resolve(container);
                }, reject);
            });
        });
    });

    return View;
});
