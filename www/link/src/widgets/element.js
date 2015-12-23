define([
    'classify',
    'link/widget'
], function(classify, Widget) {
    /**
     * Basic element.
     *
     * @class ElementWidget
     * @extends Widget
     */
    classify.classify(Widget, 'ElementWidget', function() {
        /**
         * Render text into the widget container.
         *
         * @method render
         * @param {string} model - Text to render.
         * @return {Promise} Promise that resolve instantly
         */
        classify.def('render', function(model) {
            var me = this;

            return new Promise(function(resolve, reject) {
                me.container.text(model);
                resolve();
            });
        });
    });

    return ElementWidget;
});