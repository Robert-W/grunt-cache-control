'use strict';

var grunt = require('grunt');
var exec = require('child_process').exec;

//running tasks with grunt.tasks() caused strange problems, the best way i found to do this
//is to define separate config cases under fixtures and then invoke grunt with the target file
//the target file must be defined under test/fixtures/grunt-config
function runGruntTask (gruntFile, callback) {
  exec('grunt --gruntfile test/fixtures/grunt-config/%s.js'.replace('%s', gruntFile), function (err, sdout, stderr) {
    if(err){throw err;}
    callback();
  });
}

exports.cache_control = {
    tearDown: function (done) {
        grunt.file.delete('test/tmp');
        grunt.file.mkdir('test/tmp');
        done();
    },
    default_options: function(test) {
      test.expect(1);
      //copy fixtures/default.html to tmp because replace is true by default
      grunt.file.copy('test/fixtures/default.html', 'test/tmp/default.html');
      runGruntTask('default', function () {
          test.strictEqual(
              grunt.file.read('test/tmp/default.html'),
              grunt.file.read('test/expected/default.html'),
              "with default options, both links and scripts are appended with v=1.0 and replaced in the same file"
          );
          test.done();
      });
  },
    output_dest_set_replace_is_false_source_is_intact: function (test) {
        test.expect(2);
        var sourceHtml = grunt.file.read('test/fixtures/default.html');
        runGruntTask('output_dest_set_replace_is_false_source_is_intact', function () {
            test.strictEqual(
                sourceHtml,
                grunt.file.read('test/fixtures/default.html'),
                "source html file is left intact if outputDest is set"
            );
            test.strictEqual(
                grunt.file.read('test/tmp/target.html'),
                grunt.file.read('test/expected/default.html'),
                "destination file is processed correctly when outputDest is set"
            );
            test.done();
        });
    },
    //process an already processed file with same options, must remain the same
    process_is_idempotent: function (test) {
        test.expect(1);
        grunt.file.copy('test/expected/default.html', 'test/tmp/default.html');
        runGruntTask('default', function () {
            test.strictEqual(
                grunt.file.read('test/tmp/default.html'),
                grunt.file.read('test/expected/default.html'),
                "process is idempotent if ran on a file with the same options as previous run"
            );
            test.done();
        });
    },
    file_is_updated_with_new_version: function (test) {
        test.expect(1);
        //test/expected/default.html is processed as v=1.0
        grunt.file.copy('test/expected/default.html', 'test/tmp/v2.0.html');
        runGruntTask('file-is-updated-with-new-version', function () {
            test.strictEqual(
                grunt.file.read('test/tmp/v2.0.html'),
                grunt.file.read('test/expected/v2.0.html'),
                "if a file is updated with a new version, that version is set correctly"
            );
            test.done();
        });
    },
    files_in_filesToIgnore_are_left_unprocessed: function (test) {
        test.expect(1);
        grunt.file.copy('test/fixtures/default.html', 'test/tmp/default.html');
        runGruntTask('ignored', function () {
            test.strictEqual(
               grunt.file.read('test/tmp/default.html'),
               grunt.file.read('test/expected/ignored.html'),
                "files in filesToIgnore must be left unprocessed"
            );
            test.done();
        });
    },
    files_matching_ignorePatterns_are_left_unprocessed: function (test) {
        test.expect(1);
        runGruntTask('files-matching-ignorePatterns-are-left-unprocessed', function () {
            test.strictEqual(
                grunt.file.read('test/tmp/default2.html'),
                grunt.file.read('test/expected/default2.html'),
                "files matching any of the patterns defined under ignorePatterns are unprocessed"
            );
            test.done();
        });
    }
};
