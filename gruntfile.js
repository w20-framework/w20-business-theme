module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        clean: [
            'bower_components/**'
        ],
        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: grunt.option('port') || 9999,
                    base: '.',
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['clean', 'bower']);
};