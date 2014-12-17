module.exports = function(grunt) {
  grunt.initConfig({
    cache_control: {
      default: {
        source: '../../tmp/default.html',
        options: {
          filesToIgnore: ['test33.css', 'test/testIgnore.js'],
          version: "3.5.1"
        }
      }
    }
  });
  grunt.loadTasks('../../../tasks');
  grunt.registerTask('default', ['cache_control:default']);
};
