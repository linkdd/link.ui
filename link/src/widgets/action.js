define([
    'classify',
    'jquery',
    'link/widgets/element',
    'link/actionregistry'
], function(classify, $, Widget, ActionRegistry) {
    /**
     * Trigger a named action on event.
     *
     * @class ActionWidget
     * @extends ElementWidget
     */
    classify.classify(Widget, 'ActionWidget', function() {
        /**
         * @class BoxWidget
         * @constructor
         */
        classify.def('initialize', function() {
            this.callSuper();

            var action = this.config.action || {
                event: 'click',
                name: 'activate',
                args: ['body', 'click']
            };

            this.container.on(action.event, function() {
                ActionRegistry.call(action.name, action.args);
            });
        });
    });

    return BoxWidget;
});