define(['classify'], function(classify) {

    classify.classify('Controller', function() {
        classify.def('initialize', function(application, conf) {
            this.application = application;
            this.conf = conf;
        });
    });

    return Controller;
});
