module.exports = function(grunt) {
    'use strict';

    require('jit-grunt')(grunt);

    grunt.initConfig({
        less: {
            production: {
                files: {
                    'css/w20-business-theme.css': 'less/main.less'
                }
            }
        },
        watch: {
            styles: {
                files: ['less/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.registerTask('default', ['less']);
};