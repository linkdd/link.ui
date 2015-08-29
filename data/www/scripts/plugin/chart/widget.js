define([
    'classify',
    'app/lib/widget',
    'jquery',
    'c3'
], function(classify, Widget, $, c3) {

    classify.classify(Widget, 'ChartWidget', function() {
        classify.def('initialize', function() {
            this.callSuper();

            var data = {
                columns: [],
                type: 'spline',
                types: {}
            };

            if (this.conf.data !== undefined) {
                $.extend(data, this.conf.data);
            }

            this.series = {};

            for (var serieid in this.conf.serie) {
                console.log('chart init data:', this.cid, serieid);
                data.columns.push([serieid, 0]);

                if (this.conf.serie[serieid].style !== undefined) {
                    data.types[serieid] = this.conf.serie[serieid].style;
                }

                this.series[serieid] = this.conf.serie[serieid];
            }

            console.log('chart init:', this.cid, this.series, data);

            this.chartOptions = {
                bindto: '#' + this.cid,
                data: data
            };

            $.extend(this.chartOptions, this.conf.chart);

            this.chart = c3.generate(this.chartOptions);
            this.container.append(this.chart.element);
        });

        classify.def('fetchData', function() {
            console.log('chart fetchData:', this.cid);
            var me = this,
                promises = [];

            $.each(this.series, function(serieid, serieconf) {
                console.log('chart eachSerie:', me.cid, serieid);

                var toSerie = function(payload) {
                    console.log('chart toSerie:', me.cid, serieid, payload);
                    return [serieid].concat(payload);
                };

                var ctrl = me.application.controllers[serieconf.type];
                var p = ctrl.get(serieconf.source).then(toSerie);

                promises.push(p);
            });

            return $.when.apply(window, promises);
        });

        classify.def('receiveData', function() {
            var data = {
                columns: []
            };

            $.each(arguments, function(i, responses) {
                for (var i = 0, l = responses.length; i < l; i++) {
                    data.columns.push(responses[i]);
                }
            });

            console.log('chart receiveData:', this.cid, data);

            this.chart.load(data);
        });
    });

    return ChartWidget;
});
