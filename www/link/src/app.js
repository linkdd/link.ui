define([
    'classify',
    'jquery',
    'nprogress',
    'link/controller',
    'link/widgetregistry',
    'link/actionregistry'
], function(
    classify,
    $,
    NProgress,
    Controller,
    WidgetRegistry,
    ActionRegistry
) {
    /**
     * Link main application.
     *
     * @class Application
     * @main Link
     */
    classify.classify('Application', function() {
        /**
         * @class Application
         * @constructor
         * @param {object} config - Application configuration.
         */
        classify.def('initialize', function(config) {
            this.config = config || {};
            this.routes = this.config.routes || {};
            this.refreshInterval = this.config.refreshInterval || 10;

            if (this.config.container !== undefined) {
                this.container = $('#' + this.config.container);
            }
            else {
                this.container = $('body');
            }

            this.controllers = {};
            this.ready = false;

            NProgress.configure(this.config.nprogress || {});
        });

        /**
         * Initialize route controller, and load it.
         * When controller is fully loaded, set ready state on application.
         *
         * @method route
         * @param {string} url - Hash URL to go to.
         */
        classify.def('route', function(url) {
            this.ready = false;

            NProgress.start();

            var controller = this.routes[url],
                promise = undefined,
                me = this;

            if (this.controllers[url] === undefined) {
                promise = new Promise(function(resolve, reject) {
                    if (typeof (controller) === "string") {
                        $.getJSON(controller).then(function(ctrlconfig) {
                            NProgress.inc();

                            resolve(ctrlconfig);
                        }, reject);
                    }
                    else {
                        NProgress.inc();

                        resolve(controller);
                    };
                });

                this.controllers[url] = {
                    ready: promise,
                    instance: null
                };
            }

            this.controllers[url].ready.then(function(ctrlconfig) {
                NProgress.inc();

                if (me.controllers[url].instance === null) {
                    me.controllers[url].instance = new Controller(
                        me.container,
                        ctrlconfig
                    );
                }

                me.update();
            });
        });

        /**
         * Request current loaded controller to update.
         *
         * @method update
         */
        classify.def('update', function() {
            var controller = this.controllers[window.location.hash].instance;

            this.ready = new Promise(function(resolve, reject) {
                controller.load().then(function() {
                    NProgress.done();
                    resolve();
                }, reject);
            });
        });

        /**
         * Start listening for URL changes and update loop.
         *
         * @method start
         */
        classify.def('start', function() {
            var me = this;

            $.when([
                WidgetRegistry.ready(),
                ActionRegistry.ready(),
            ]).then(function() {
                if (!window.location.hash) {
                    window.location.hash = '#/';
                }
                else {
                    me.route(window.location.hash);
                }

                if ('onhashchange' in window) {
                    window.onhashchange = function() {
                        me.route(window.location.hash);
                    };
                }
                else {
                    var cache_hash = window.location.hash;

                    setInterval(function() {
                        if (window.location.hash !== cache_hash) {
                            cache_hash = window.location.hash;
                            me.route(cache_hash);
                        }
                    }, 100);
                }

                setInterval(function() {
                    if (me.ready !== false) {
                        NProgress.start();

                        me.ready.then(function() {
                            NProgress.inc();

                            me.update();
                        });
                    }
                }, me.refreshInterval * 1000);
            });
        });
    });

    return Application;
});
