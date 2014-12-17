module.exports = function(grunt) {
  grunt.initConfig({
    cache_control: {
      default: {
        source: '../default.html',
        options: {
          replace: false,
          outputDest: '../../tmp/target.html'
        }
      }
    }
  });
  grunt.loadTasks('../../../tasks');
  grunt.registerTask('default', ['cache_control:default']);
};
