module.exports = function(grunt) {
    grunt.initConfig({
        cache_control: {
            default: {
                source: '../default2.html',
                options: {
                    replace: false,
                    outputDest: '../../tmp/default2.html',
                    ignorePatterns: [/^vendor\/[\w\/]+\.min\.js$/, /^vendor\/[\w\/]+\.css/]
                }
            }
        }
    });
    grunt.loadTasks('../../../tasks');
    grunt.registerTask('default', ['cache_control:default']);
};
