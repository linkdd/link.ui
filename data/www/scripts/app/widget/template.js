define(['classify', 'jquery', 'app/lib/widget'], function(classify, $, Widget) {

    classify.classify(Widget, 'TemplateWidget', function() {
        classify.def('initialize', function() {
            this.callSuper();

            this.renderer = $.Deferred();
        });

        classify.def('template', function(text, scope) {
            var re = /{{[\w\d \.]*}}/gi;
            var slots = text.match(re);

            if (slots) {
                function evaluator(path) {
                    var root = this,
                        path = path.split('.');

                    $.each(path, function(i, elem) {
                        root = root[elem];
                    });

                    return root;
                }

                $.each(slots, function(i, slot) {
                    var path = slot.replace(/[{} ]/gi, '');

                    text = text.replace(
                        new RegExp(slot, 'gi'),
                        evaluator.apply(scope, [path])
                    );
                });
            }

            return text;
        });

        classify.def('fetchData', function() {
            return $.getJSON(this.conf.scope);
        });

        classify.def('receiveData', function(payload) {
            var tmpl = this.conf.template,
                wconfs = [],
                children = [],
                me = this;

            if (tmpl.type === 'each') {
                wconfs = this.loopRendering(payload[0]);
            }
            else {
                wconfs = [this.withRendering(payload[0])];
            }

            $.each(wconfs, function(i, wconf) {
                children.push(me.application.buildWidget(wconf));
            });

            this.renderer.resolve(children);
        });

        classify.def('requestUpdate', function() {
            this.callSuper();

            var me = this;
            this.ready.then(function() {
                me.renderer.then(function(children) {
                    $.each(children, function(i, child) {
                        child.requestUpdate();
                    });
                });
            });
        });

        classify.def('render', function() {
            var me = this;

            this.renderer.then(function(children) {
                me.container.html('');

                $.each(children, function(i, child) {
                    me.application.renderWidget(child, me.container);
                });
            });

            this.setReady();
        });

        classify.def('inDOM', function() {
            var me = this;

            this.renderer.then(function(children) {
                $.each(children, function(i, child) {
                    child.inDOM();
                });
            });

            this.callSuper();
        });

        classify.def('loopRendering', function(scope) {
            var tmpl = this.conf.template,
                me = this,
                confs = [];

            $.each(scope, function(key, item) {
                var source = {};
                $.extend(true, source, tmpl.source);

                function parser(skey, value) {
                    if (value instanceof String || typeof value === 'string') {
                        this[skey] = me.template(value, {
                            item: {
                                key: key,
                                value: item
                            }
                        });
                    }
                    else if (value instanceof Object
                        || typeof value === 'object')
                    {
                        if (value.xtype !== 'template') {
                            $.each(value, parser.bind(value));
                        }
                    }
                    else if (value instanceof Array
                        || typeof value === 'array')
                    {
                        $.each(value, parser.bind(value));
                    }
                }

                $.each(source, parser.bind(source));

                confs.push(source);
            });

            return confs;
        });

        classify.def('withRendering', function(scope) {
            var tmpl = this.conf.template,
                source = {},
                me = this;

            $.extend(true, source, tmpl.source);

            function parser(key, value) {
                if (value instanceof Object || value instanceof Array) {
                    $.each(value, parser);
                }
                else if (value instanceof String) {
                    this[key] = me.template(value, scope);
                }
            }

            $.each(source, parser);

            return source;
        });
    });

    return TemplateWidget;
});
