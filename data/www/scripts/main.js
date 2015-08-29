requirejs.config({
    baseUrl: 'scripts/lib',
    paths: {
        app: '../app',
        plugin: '../plugin',

        text: 'external/requirejs-text/text',
        json: 'external/requirejs-plugins/src/json',
        jquery: 'external/jquery/dist/jquery.min',
        'jqueryui': 'external/jquery-ui/jquery-ui.min',
        'jquery-ui': 'external/jquery-ui/ui',
        bootstrap: 'external/bootstrap/dist/js/bootstrap.min',
        adminlte: 'external/adminlte/dist/js/app.min',
        slimscroll: 'external/slimscroll/jquery.slimscroll.min',
        d3: 'external/d3/d3.min',
        c3: 'external/c3/c3.min',
        jsoneditor: 'external/jsoneditor/dist/jsoneditor.min',
        'nprogress': 'external/nprogress/nprogress'
    },

    map: {
        '*': {
            'css': 'external/require-css/css.min'
        }
    },

    shim: {
        c3: {
            deps: [
                'd3',
                'css!external/c3/c3.min'
            ]
        },

        bootstrap: {
            deps: [
                'jquery',
                'css!external/bootstrap/dist/css/bootstrap.min',
                'css!external/fontawesome/css/font-awesome.min'
            ]
        },

        'jquery-ui': {
            deps: ['jquery', 'jqueryui']
        },

        slimscroll: {
            deps: ['jquery']
        },

        adminlte: {
            deps: [
                'jquery',
                'jqueryui',
                'bootstrap',
                'slimscroll',
                'css!external/adminlte/dist/css/AdminLTE.min',
                'css!external/adminlte/dist/css/skins/_all-skins.min',
                'css!external/ionicons/css/ionicons.min'
            ]
        },

        jsoneditor: {
            deps: [
                'css!external/jsoneditor/dist/jsoneditor.min'
            ]
        },

        nprogress: {
            deps: [
                'css!external/nprogress/nprogress'
            ]
        }
    }
});

requirejs([
    'nprogress',
    'text',
    'json',
    'adminlte'
], function(NProgress) {
    NProgress.configure({ trickle: false });
    NProgress.start();

    require([
        'app/main',
        'json!../config.json'
    ], function(Initializer, config) {
        NProgress.inc();

        require(['json!' + config.url], function(conf) {
            NProgress.inc();

            window.LinkInterface = new Initializer(conf);
            window.LinkInterface.load();
        });
    });
});
