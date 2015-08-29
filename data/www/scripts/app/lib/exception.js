define(['classify'], function(classify) {

    classify.classify('Exception', function() {
        classify.def('initialize', function(kwargs) {
            this.msg = kwargs.msg || '';
            this.data = kwargs.data || {};
        });

        classify.def('toString', function() {
            var clsname = this.constructor.toString();

            var out = clsname + ': ' + this.msg + '\n';
            out += ' - data: ' + JSON.stringify(this.data);

            return out;
        });
    });

    return Exception;
});
