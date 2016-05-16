define([
    'classify',
    'jquery',
    'link/widget',
    'link/widgetregistry'
], function(classify, $, Widget, WidgetRegistry) {
    /**
     * Contains multiple widgets.
     *
     * @class BoxWidget
     * @extends Widget
     */
    classify.classify(Widget, 'BoxWidget', function() {
        /**
         * @class BoxWidget
         * @constructor
         */
        classify.def('initialize', function() {
            this.callSuper();

            this.children = [];

            var wchildren = this.config.children || [],
                me = this;

            $.each(wchildren, function(idx, child) {
                var widget = WidgetRegistry.create(child);

                me.children.push(widget);
                me.container.append(widget.container);
            });
        });

        /**
         * Render array of models into box widget.
         *
         * @method render
         * @param {array} model - Models to render.
         * @return {Promise} Promise resolved when all subwidgets are rendered.
         */
        classify.def('render', function(model) {
            var me = this;

            return new Promise(function(resolve, reject) {
                var p = [];

                $.each(me.children, function(idx, child) {
                    p.push(child.render(model[idx]));
                });

                $.when(p).then(resolve, reject);
            });
        });
    });

    return BoxWidget;
});