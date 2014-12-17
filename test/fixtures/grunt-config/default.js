module.exports = function(grunt) {
  grunt.initConfig({
    cache_control: {
      default: {
        source: '../../tmp/default.html'
      }
    }
  });
  grunt.loadTasks('../../../tasks');
  grunt.registerTask('default', ['cache_control:default']);
};
