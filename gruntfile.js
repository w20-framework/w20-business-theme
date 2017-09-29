/*
 * Copyright (c) 2013-2016, The SeedStack authors <http://seedstack.org>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
        },
        jshint: {
            business: {
                src: ['modules/**/*.js']
            }
        },
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['less','jshint']);
};