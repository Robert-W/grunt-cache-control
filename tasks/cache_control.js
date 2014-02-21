/*
 * grunt-cache-control
 * https://github.com/Robert-W/grunt-cache-control
 *
 * Copyright (c) 2014 Robert Winterbottom
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks


  /*
    Plugin Requirements/Test Cases
    1. Plugin should read in a html file.
      - If invalid file provided, report error and close
    -- DONE

    2 & 3 are optional and will come in at a later time
    2. Mix in Options and determine where to apply ?v={versionNumber}
      - Options Include
        * Which file(s) are affected
          -- Also the standard option to include all js and css
        * Which version number to append
        * Multiple file sets with different version numbers
        * Whether or not to remove link tags and concatenate them into one file, and dest directory
    3. If concat option is specified, remove all specified file(s) references from html
      - concat files and write to specified destination
        * If no destination provided, log error and continue with other tasks
      - add new link to html referencing new file and write ?v={versionNumber} to the end of it
    4. Grab script tags and write ?v={versionNumber} to the end of it -- DONE
    5. If they are using dojo, add cacheBust: "v={versionNumber}" to dojoConfig -- DONE

  */

  var options,
    dojoConfigWin,
    numScripts,
    numLinks,
    partial,
    done,
    page,
    src;

  var getIndexFile = function (src) {
    return grunt.file.read(src);
  };

  // html content, ignoreHttp currently always true, ignore src if begins with http or //
  var modifyLinks = function (html) {
    var count = 0;
    page = html.replace(/<link(.*?)\/>/g,function (match) {
      if (match.indexOf("stylesheet") > -1) {
        return match.replace(/href="([^"]*")/, function (ref) {
          // Ignore CDN References
          if (options.ignoreCDN) {
            // remove src= from the match so all that is left is the quotes and string
            partial = src.slice(4);
            if (partial.slice(1,3) === "//" || partial.slice(1,5) === "http"){
              return src;
            }
          }
          // Grab files from Ignore List
          if (options.filesToIgnore.length > 0) {
            partial = src.slice(5, src.length - 1);
            if (options.filesToIgnore.indexOf(partial) > -1) {
              return src;
            }
          }

          count++; // Track how many files are changed
          if (ref.indexOf("?v=") > -1) {
            return ref.replace(/v=(.*)/,'v=' + options.version + '"');
          } else {
            return ref.slice(0, ref.length - 1) + '?v=' + options.version + '"';
          }
        });
      } else {
        return match;
      }
    });
    return count;
  };

  // html content, ignoreHttp currently always true, ignore src if begins with http or //
  var modifyScripts = function (html) {
    var count = 0;
    page = html.replace(/<script[^>]*>(.*?)<\/script>/g,function (match) {
      if (match.indexOf("src") > -1) {
        return match.replace(/src="([^"]*")/, function (src) {
          // Ignore CDN References
          if (options.ignoreCDN) {
            // remove src= from the match so all that is left is the quotes and string
            partial = src.slice(4);
            if (partial.slice(1,3) === "//" || partial.slice(1,5) === "http"){
              return src;
            }
          }
          // Grab files from Ignore List
          if (options.filesToIgnore.length > 0) {
            partial = src.slice(5, src.length - 1);
            if (options.filesToIgnore.indexOf(partial) > -1) {
              return src;
            }
          }

          count++; // Track how many files are changed
          if (src.indexOf("?v=") > -1) {
            return src.replace(/v=(.*)/,'v=' + options.version + '"');
          } else {
            return src.slice(0, src.length - 1) + '?v=' + options.version + '"';
          }
        });
      } else {
        return match;
      }
    });
    return count;
  };

  var modifyDojoConfig = function (html) {
    var result = false;
    page = html.replace(/<script[^>]*>((?:.|\r?\n)*?)<\/script>/g,function (match) {
      if (match.indexOf("cacheBust") > -1) {
        return match.replace(/cacheBust.*$/m, function (bust) {
          result = true;
          return 'cacheBust: "v=' + options.version + '",';
        });
      } else {
        return match;
      }
    });
    return result;
  };


  grunt.registerMultiTask('cache_control', 'Append versions to your files to control cache easily.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      version: "1.0",
      links: false,
      scripts: false,
      replace: true,
      ignoreCDN: true,
      filesToIgnore: [],
      dojoCacheBust: false
    });

    // Tell Grunt not to finish until my async methods are completed, calling done() to finish
    done = this.async();

    src = this.data.source;

    // Make sure the file exists
    if (!grunt.file.isFile(src)) {
      grunt.fatal('Source file "' + src + '" not found.');
    }

    // Make sure the path is for a html or htm file
    if (src.slice(src.length - 5) !== ".html" && src.slice(src.length - 4) !== ".htm") {
      grunt.fatal('Source file "' + src + '" needs to end with .html or .htm');
    }

    // Get the page
    page = getIndexFile(src);

    if (options.links) {
      numLinks = modifyLinks(page);
      grunt.log.ok(numLinks + " link tags have been modified.");
    }

    if (options.scripts) {
      numScripts = modifyScripts(page);
      grunt.log.ok(numScripts + " script tags have been modified.");
    }

    if (options.dojoCacheBust) {
      dojoConfigWin = modifyDojoConfig(page);
      if (dojoConfigWin) {
        grunt.log.ok("dojoConfig variable has been successfully modified.");
      } else {
        grunt.log.error("Unable to modify dojoConfig.");
      }
    }

    if (options.replace) {
      grunt.file.write(src, page);
      grunt.log.ok("File successfully updated.");
    } else {
      if (options.outputDest) {
        grunt.file.write(options.outputDest, page);
        grunt.log.ok("File successfully written to " + options.outputDest + ".");
      } else {
        grunt.fatal("Unable to write file. Destination needs to be provided via outputDest in options or replace set to true.");
      }
    }

    // Iterate over all specified file groups.
//    this.files.forEach(function(f) {
//      // Concat specified files.
//      var src = f.src.filter(function(filepath) {
//        // Warn on and remove invalid source files (if nonull was set).
//        if (!grunt.file.exists(filepath)) {
//          grunt.log.warn('Source file "' + filepath + '" not found.');
//          return false;
//        } else {
//          return true;
//        }
//      }).map(function(filepath) {
//        // Read file source.
//        return grunt.file.read(filepath);
//      }).join(grunt.util.normalizelf(options.separator));
//
//      // Handle options.
//      src += options.punctuation;
//
//      // Write the destination file.
//      grunt.file.write(f.dest, src);
//
//      // Print a success message.
//      grunt.log.writeln('File "' + f.dest + '" created.');
//    });



  });

};
