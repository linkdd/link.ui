define(['classify', 'jquery', 'app/lib/widget'], function(classify, $, Widget) {

    classify.classify(Widget, 'AjaxViewWidget', function() {
        classify.def('initialize', function() {
            this.callSuper();

            var p = this.application.controllers.ajax.get(this.conf.url),
                me = this;

            this.renderer = p.then(function(view) {
                console.log('build it', view);
                var widget = me.application.buildWidget(view, this);
                return widget;
            });
        });

        classify.def('doUpdate', function() {
            this.renderer.then(function(widget) {
                widget.requestUpdate();
            });
        });

        classify.def('render', function() {
            var me = this;

            this.renderer.then(function(widget) {
                me.application.renderWidget(widget, me.container);

                if (me.application.container.find(me.container)) {
                    widget.inDOM();
                }

                me.setReady(widget);
            });
        });
    });

    return AjaxViewWidget;
});
