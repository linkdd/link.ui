define(['classify', 'jquery'], function(classify, $) {
    classify.def('ActionGoto', function(url) {
        window.location.hash = '#' + url;
    });

    return ActionGoto;
});