define([
    'nprogress',
    'classify',
    'jquery',
    'app/lib/application',
    'app/lib/exception'
], function(NProgress, classify, $, CoreApplication, Exception) {

    classify.classify('Initializer', function() {
        classify.def('initialize', function(config) {
            this.config = config;

            this.application = new CoreApplication(this.config);
        });

        classify.def('getDeps', function() {
            var deps = [];

            for (var loadername in this.config.loaders) {
                for (var itemname in this.config.loaders[loadername]) {
                    deps.push(this.config.loaders[loadername][itemname]);
                }
            }

            return deps;
        });

        classify.def('initControllers', function() {
            for (var controllername in this.config.controllers) {
                console.log('init controller:', controllername);

                if (this.config.controllers[controllername].enabled === true) {
                    this.application.initController(
                        controllername,
                        this.config.controllers[controllername]
                    );
                }
            }

            NProgress.inc();
        });

        classify.def('getCurrentUrl', function() {
            var urlentry = this.urls[window.location.hash]

            if (urlentry !== undefined) {
                return urlentry.widget;
            }
        });

        classify.def('loadUrl', function(url, changed) {
            var urlentry = this.urls[url];

            if (urlentry !== undefined) {
                var me = this;

                urlentry.ready.then(function() {
                    console.log('url ready to render:', urlentry);
                    NProgress.inc();

                    if (urlentry.widget === undefined) {
                        urlentry.widget = me.application.buildWidget(urlentry.conf);
                    }

                    if (changed === true) {
                        me.application.container.html('');
                    }

                    me.application.renderWidget(urlentry.widget);
                    urlentry.widget.inDOM();
                    urlentry.widget.requestUpdate();
                    urlentry.widget.ready.then(function() {
                        NProgress.done();
                    });
                }, function(err) {
                    throw err;
                });
            }
        });

        classify.def('listenUrls', function() {
            var me = this;

            me.urls = {};

            /* create url entries so other methods can wait for results */
            for (var i = 0, l = me.config.gui.routes.length; i < l; i++) {
                var route = me.config.gui.routes[i];
                me.urls['#' + route.path] = {
                    widget: undefined,
                    conf: undefined,
                    view: route.view,
                    ready: $.Deferred() // used to wait for conf
                };
            }

            console.log('urls: ', me.urls);

            /* we need the navbar to build the page skeleton */
            $.getJSON(me.config.gui.navbar).then(function(navbar) {
                NProgress.inc();

                var views = [];

                /* get JSON views locations */
                for (var i = 0, l = me.config.gui.routes.length; i < l; i++) {
                    var route = me.config.gui.routes[i];
                    var urlentry = me.urls['#' + route.path];

                    /* create page skeleton */
                    urlentry.conf = {
                        xtype: 'box',
                        class: 'wrapper',
                        children: [navbar]
                    };

                    views.push($.getJSON(route.view));
                }

                $.when.apply($, views).then(function() {
                    NProgress.inc();

                    var confs = [];

                    /* get JSON views components location */
                    for (var i = 0, l = me.config.gui.routes.length; i < l; i++) {
                        var view = arguments[i][0],
                            route = me.config.gui.routes[i];
                        var urlentry = me.urls['#' + route.path];

                        urlentry.name = view.name;

                        confs.push($.getJSON(view.content));
                        confs.push($.getJSON(view.sidebar));
                    }

                    $.when.apply($, confs).then(function() {
                        NProgress.inc();

                        for (var i = 0, l = me.config.gui.routes.length; i < l; i++) {
                            var content = arguments[i * 2][0],
                                sidebar = arguments[i * 2 + 1][0],
                                route = me.config.gui.routes[i];
                            var urlentry = me.urls['#' + route.path];

                            /* add widgets to page skeleton */
                            if (sidebar) {
                                urlentry.conf.children.push(sidebar);
                            }

                            if (content) {
                                urlentry.conf.children.push({
                                    xtype: 'box',
                                    class: 'tab-content',
                                    children: content
                                });
                            }

                            /* those who wait for conf will be notified */
                            urlentry.ready.resolve();
                        }
                    }, function() {
                        throw new Exception({
                            msg: 'Unable to fetch views configuration',
                            data: arguments
                        });
                    });
                }, function() {
                    throw new Exception({
                        msg: 'Unable to fetch views',
                        data: arguments
                    });
                });
            }, function() {
                throw new Exception({
                    msg: 'Unable to fetch navbar configuration',
                    data: arguments
                });
            });

            /* now listen for page changes */
            if (!window.location.hash) {
                window.location.hash = '#/';
            }
            else {
                me.loadUrl(window.location.hash);
            }

            if ('onhashchange' in window) {
                window.onhashchange = function() {
                    me.loadUrl(window.location.hash, true);
                };
            }
            else {
                console.warning('no onhashchange event, using setInterval');
                var cache_hash = window.location.hash;

                setInterval(function() {
                    if (window.location.hash !== cache_hash) {
                        cache_hash = window.location.hash;
                        me.loadUrl(cache_hash, true);
                    }
                }, 100);
            }
        });

        classify.def('listenData', function() {
            var me = this;

            this.listenning = true;

            setInterval(function() {
                if (me.listenning === true) {
                    var wobj = me.getCurrentUrl();

                    if (wobj !== undefined) {
                        wobj.requestUpdate();
                        wobj.render();
                    }
                    else {
                        console.error('No current widget loaded');
                    }
                }
            }, this.config.gui.interval * 1000);
        });

        classify.def('load', function() {
            console.log('start loading');
            var me = this;

            require(this.getDeps(), function () {
                NProgress.inc();

                me.initControllers();
                me.listenUrls();
                me.listenData();
            });
        });
    });

    return Initializer;
});
