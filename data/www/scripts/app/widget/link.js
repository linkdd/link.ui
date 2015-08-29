define(['classify', 'jquery', 'app/widget/box'], function(classify, $, BoxWidget) {

    classify.classify(BoxWidget, 'LinkWidget', function() {
        classify.def('initialize', function() {
            var me = this;

            this.tag = 'a';

            this.callSuper();

            $.each(window.LinkInterface.urls, function(url, urlentry) {
                urlentry.ready.then(function() {
                    if (urlentry.name === me.conf.view) {
                        me.container.attr('href', url);
                    }
                });
            });
        });
    });

    return LinkWidget;
});
