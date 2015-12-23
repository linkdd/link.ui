requirejs.config({
    baseUrl: '.',
    paths: {
        'link-framework': '../dist/link',
        text: '../lib/requirejs-text/text',
        json: '../lib/requirejs-plugins/src/json',
    }
});

requirejs([
    'link-framework',
    'json!config.json'
], function(Link, config) {
    window.Application = new Link.Application(config);
    window.Application.start();
});
