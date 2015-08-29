define(['classify', 'jquery', 'app/widget/box'], function(classify, $, BoxWidget) {

    classify.classify(BoxWidget, 'AjaxBoxWidget', function() {
        classify.def('addWidgets', function() {
            var p = this.application.controllers.ajax.get(this.conf.children),
                me = this;

            this.renderer = p.then(function(children) {
                $.each(children, function(i, wchild) {
                    me.addWidget(wchild);
                });
            });
        });

        classify.def('render', function() {
            var me = this;

            this.renderer.then(function() {
                $.each(me.children, function(i, widget) {
                    me.application.renderWidget(widget, me.container);

                    if (me.application.container.find(me.container)) {
                        widget.inDOM();
                    }
                });

                me.setReady(me.children);
            });
        });
    });

    return AjaxBoxWidget;
});
