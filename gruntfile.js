module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
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
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['bower']);
};