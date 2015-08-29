define(['classify', 'jquery', 'app/lib/controller'], function(classify, $, Controller) {

    classify.classify(Controller, 'RestController', function() {
        classify.def('initialize', function() {
            this.callSuper();

            this.client = $.RestClient(this.conf.url);

            var me = this;

            $.each(this.conf.resources, function(resource) {
                me.client.add(resource);
            });
        });

        classify.def('post', function(resource, data, params) {
            return this.client[resource].create(data, params);
        });

        classify.def('get', function(resource, id, params) {
            return this.client[resource].read(id, params);
        });

        classify.def('put', function(resource, id, data, params) {
            return this.client[resource].update(id, data, params);
        });

        classify.def('delete', function(resource, id, params) {
            return this.client[resource].destroy(id, params);
        });
    });

    return RestController;
});
