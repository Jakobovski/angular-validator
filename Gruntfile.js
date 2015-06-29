/*jslint node: true */
'use strict';

var pkg = require('./package.json');

module.exports = function(grunt) {

    // Grunt Config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '.'
                }
            }
        },
        concat: {
            "options": {
                "separator": ";"
            },
            "build": {
                "src": "src/*.js",
                "dest": "dist/angular-validator.js"
            }
        },
        ngAnnotate: {
            main: {
                src: 'dist/angular-validator.js',
                dest: 'dist/angular-validator.js'
            },
        },
        uglify: {
            dist: {
                src: "dist/angular-validator.js",
                dest: "dist/angular-validator.min.js"
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/*.js'],
            options: {
                jshintrc: true
            }
        },
        watch: {
            files: ['src/*.js', 'demo/*.*'],
            tasks: ['build'],
            options: {
                livereload: true
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            build: {
                singleRun: true,
                autoWatch: true
            },
            debug: {
                singleRun: false,
                autoWatch: true,
                browsers: ['Chrome']
            },
            travis: {
                singleRun: true,
                autoWatch: false,
                browsers: ['Firefox']
            },
            dev: {
                autoWatch: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-ng-annotate');

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');



    // Register Task
    grunt.registerTask('serve', ['connect', 'watch']);
    grunt.registerTask('build', ['concat', 'ngAnnotate', 'uglify', 'karma:build']);
    grunt.registerTask('test', ['karma:build', ]);
    grunt.registerTask('test-debug', ['karma:debug']);
    grunt.registerTask('travis', ['karma:travis']);
};