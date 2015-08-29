define(['classify', 'jquery', 'app/lib/widget'], function(classify, $, Widget) {

    classify.classify(Widget, 'ElementWidget', function() {
        classify.def('render', function() {
            if (this.conf.text !== undefined) {
                this.container.text(this.conf.text);
            }

            this.setReady();
        });
    });

    return ElementWidget;
});
