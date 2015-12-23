define([
    'classify',
    'jquery',
    'link/view'
], function(classify, $, View) {
    /**
     * Control data request and rendering for an URL.
     *
     * @class Controller
     * @main Link
     */
    classify.classify('Controller', function() {
        /**
         * @class Controller
         * @constructor
         * @param {object} container - DOM object containing view.
         * @param {object} config - Controller config.
         */
        classify.def('initialize', function(container, config) {
            this.container = container;
            this.config = config || {};
            this.model = this.config.model || {};
            this.viewcfg = this.config.view || {};
            this.view = null;
        });

        /**
         * Start loading controller model, and render it once view is loaded.
         *
         * @method load
         * @return {Promise} Promise resolved when controller is loaded.
         */
        classify.def('load', function() {
            var me = this;

            var modelreq = new Promise(function(resolve, reject) {
                if (typeof (me.model) === 'string') {
                    $.getJSON(me.model).then(resolve, reject);
                }
                else {
                    resolve(me.model);
                }
            });

            return new Promise(function(resolve, reject) {
                modelreq.then(function(model) {
                    if (me.view === null) {
                        if (typeof (me.viewcfg) === 'string') {
                            $.getJSON(me.viewcfg).then(function(viewcfg) {
                                me.view = new View(viewcfg);
                                me.render(model);
                                resolve();
                            }, reject);
                        }
                        else {
                            me.view = new View(me.viewcfg);
                            me.render(model);
                            resolve();
                        }
                    }
                    else {
                        me.render(model);
                        resolve();
                    }
                }, reject);
            });
        });

        /**
         * Render view and set its DOM element into the controller container.
         *
         * @method render
         * @param {object} model - Data for to render in the view
         */
        classify.def('render', function(model) {
            var me = this;

            this.view.render(model).then(function(domel) {
                me.container.html('');
                me.container.append(domel);
            });
        });
    });

    return Controller;
});
