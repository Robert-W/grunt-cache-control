/*
 * grunt-cache-control
 * https://github.com/Robert-W/grunt-cache-control
 *
 * Copyright (c) 2014 Robert Winterbottom
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    cache_control: {
      default: {
        source: "test/index.html",
        options: {
          version: "2.0",
          links: true,
          scripts: true,
          replace: false,
          ignoreCDN: true,
          filesToIgnore: ["test/testIgnore.js"],
          outputDest: "test/index2.html",
          dojoCacheBust: true
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'cache_control', 'nodeunit']);
  grunt.registerTask('cc', ['cache_control']);
  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
