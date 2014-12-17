module.exports = function(grunt) {
  grunt.initConfig({
    cache_control: {
      default: {
        source: '../../tmp/v2.0.html',
        options: {
          version: "2.0"
        }
      }
    }
  });
  grunt.loadTasks('../../../tasks');
  grunt.registerTask('default', ['cache_control:default']);
};
