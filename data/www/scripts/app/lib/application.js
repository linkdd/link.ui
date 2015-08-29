define(['classify', 'jquery'], function(classify, $) {

    classify.classify('Application', function() {
        classify.def('initialize', function(config) {
            this.config = config;
            this.container = $('#' + this.config.gui.container);

            this.controllers = {};
            this.widgets = {};
        });

        classify.def('initController', function(name, conf) {
            var controller = require(this.config.loaders.controllers[name]);

            this.controllers[name] = new controller(this, conf);
        });

        classify.def('generateWidgetId', function() {
            if (this.wn === undefined) {
                this.wn = 0;
            }

            var wid = 'widget-' + this.wn;

            this.wn++;

            return wid;
        });

        classify.def('registerWidget', function(wkey, wcls) {
            this.widgets[wkey] = wcls;
        });

        classify.def('buildWidget', function(widget, parent) {
            if (this.widgets[widget.xtype] === undefined) {
                this.widgets[widget.xtype] = require(
                    this.config.loaders.widgets[widget.xtype]
                );
            }

            var wcls = this.widgets[widget.xtype];
            return new wcls(this, widget, parent);
        });

        classify.def('renderWidget', function(widget, container) {
            if (container === undefined) {
                container = this.container;
            }

            widget.render();

            if (container.has(widget.container).length === 0) {
                container.append(widget.container);
            }
        });

        classify.def('clear', function() {
            this.container.html('');
            this.wn = undefined;
        });
    });

    return Application;
});
