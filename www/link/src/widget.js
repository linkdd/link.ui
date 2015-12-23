define([
    'classify',
    'link/utils'
], function(classify, Utils) {
    /**
     * Widget base class.
     *
     * @class Widget
     * @main Link
     */
    classify.classify('Widget', function() {
        /**
         * @class Widget
         * @constructor
         * @param {object} config - Widget configuration.
         */
        classify.def('initialize', function(config) {
            this.config = config;
            this.xtype = this.config.xtype;
            this.containerId = Utils.generateId('link-widget');

            var attr = this.config.attr || {},
                tag = this.config.tag || 'div';

            attr.id = this.containerId;

            this.container = $('<' + tag + '/>', attr);
        });

        /**
         * Render widget into its container.
         *
         * @method render
         * @param {object} model - Data used for rendering.
         * @return {Promise} Promise resolved when DOM element is generated.
         */
        classify.def('render', function(model) {
            throw new Error(
                'render() method not implemented for widget' + this.xtype
            );
        });
    });

    return Widget;
});