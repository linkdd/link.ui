define(['classify', 'jquery', 'app/widget/el'], function(classify, $, ElementWidget) {

    classify.classify(ElementWidget, 'BoxWidget', function() {
        classify.def('initialize', function() {
            this.callSuper();

            this.children = [];

            this.addWidgets();
        });

        classify.def('addWidgets', function() {
            var me = this;

            $.each(this.conf.children, function(i, wchild) {
                me.addWidget(wchild);
            });
        });

        classify.def('addWidget', function(conf) {
            if (conf) {
                var widget = this.application.buildWidget(conf, this);
                this.children.push(widget);
            }
        });

        classify.def('doUpdate', function() {
            $.each(this.children, function(i, widget) {
                widget.requestUpdate();
            });
        });

        classify.def('render', function() {
            var me = this;

            $.each(this.children, function(i, widget) {
                me.application.renderWidget(widget, me.container);
            });

            this.setReady(this.children);
        });

        classify.def('inDOM', function() {
            $.each(this.children, function(i, widget) {
                widget.inDOM();
            });

            this.callSuper();
        });
    });

    return BoxWidget;
});
