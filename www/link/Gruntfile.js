module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'src',
                    outdir: 'doc'
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    paths: {
                        link: '.',
                        external: '../lib',

                        text: '../lib/requirejs-text/text',
                        json: '../lib/requirejs-plugins/src/json',
                        classify: '../lib/classify/dist/classify',
                        jquery: '../lib/jquery/dist/jquery',
                        nprogress: '../lib/nprogress/nprogress'
                    },

                    map: {
                        '*': {
                            'css': 'external/require-css/css.min'
                        }
                    },

                    shim: {
                        nprogress: {
                            deps: [
                                'css!external/nprogress/nprogress'
                            ]
                        },
                        classify: {
                            exports: 'classify',
                            init: function() {
                                return {
                                    'classify': classify,
                                    'def': def,
                                    'module': module,
                                    'include': include,
                                    'extend': extend,
                                    'alias': alias
                                };
                            }
                        }
                    },

                    name: 'link/core',
                    out: 'dist/link.js',
                    optimize: 'none',
                    include: ['../node_modules/almond/almond.js'],
                    wrap: {
                        startFile: "src/wrap.start.js",
                        endFile: "src/wrap.end.js"
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['yuidoc', 'requirejs']);
};
