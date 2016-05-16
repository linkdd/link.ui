define(['classify', 'jquery'], function(classify, $) {
    classify.def('ActionActivate', function(selector, event) {
        $(selector).trigger(event);
    });

    return ActionActivate;
});