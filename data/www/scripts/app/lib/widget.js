define([
    'classify',
    'jquery'
], function(classify, $) {

    classify.classify('Widget', function() {
        classify.def('initialize', function(application, conf, parent) {
            this.application = application;
            this.conf = conf;

            this.data = {};
            this.cid = this.conf.id || this.application.generateWidgetId();

            this.tag = this.conf.tag || this.tag || 'div';
            var attr = {
                id: this.cid,
                'data-widget': this.constructor.toString(),
                class: this.conf.class,
                style: this.conf.style
            };

            $.extend(attr, this.conf.attr);

            this.container = $('<' + this.tag + '/>', attr);
            this.container.data('wobj', this);

            this.ready = $.Deferred();
        });

        classify.def('setReady', function(widget) {
            console.log(this.constructor.toString() + ' ready:', this.cid);
            var me = this;

            if (widget instanceof Widget) {
                widget.ready.then(function() {
                    me.ready.resolve();
                });
            }
            else if (widget instanceof Array) {
                $.when.apply(window, widget).then(function () {
                    me.ready.resolve();
                });
            }
            else {
                this.ready.resolve();
            }
        });

        classify.def('fetchData', function() {
            var p = $.Deferred();
            p.resolve({});
            return p;
        });

        classify.def('receiveData', function(data) {
            ;
        });

        classify.def('doUpdate', function() {
            console.log(this.constructor.toString() + ' doUpdate:', this.cid);

            var p = this.fetchData(),
                me = this;

            p.then(function() {
                me.receiveData(arguments);
            });
        });

        classify.def('requestUpdate', function() {
            var me = this;

            this.ready.then(function() {
                me.doUpdate();
            });
        });

        classify.def('inDOM', function() {
        });

        classify.def('render', function() {
            this.setReady();
        });
    });

    return Widget;
});
