(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        /* AMD module */
        define(factory);
    }
    else {
        /* Browser globals */
        root.mylib = factory();
    }
}(this, function() {