define(['classify', 'jquery', 'app/lib/controller'], function(classify, $, Controller) {

    classify.classify(Controller, 'AjaxController', function() {
        classify.def('initialize', function() {
            this.callSuper();
        });

        classify.def('ajax', function(url, method, data, settings) {
            if (settings === undefined) {
                settings = {};
            }

            settings.url = url;
            settings.method = method;

            if (data !== undefined) {
                settings.data = JSON.stringify(data);
                settings.dataType = 'json';
            }

            return $.ajax(settings);
        });

        classify.def('put', function(url, data, settings) {
            return this.ajax(url, 'PUT', data, settings);
        });

        classify.def('get', function(url, data, settings) {
            return this.ajax(url, 'GET', data, settings);
        });
    });

    return AjaxController;
});
