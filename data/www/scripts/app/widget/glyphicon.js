define(['classify', 'jquery', 'app/widget/el'], function(classify, $, ElementWidget) {

    classify.classify(ElementWidget, 'GlyphiconWidget', function() {
        classify.def('initialize', function() {
            this.tag = 'span';

            this.callSuper();
        });

        classify.def('render', function() {
            var icontype = this.conf.icontype || 'glyphicon';

            if (this.conf.icon !== undefined) {
                var glyphicon = $('<span/>', {
                    class: icontype + ' ' + icontype + '-' + this.conf.icon
                });

                this.container.html('');
                this.container.append(glyphicon);
            }

            this.setReady();
        });
    });

    return GlyphiconWidget;
});
