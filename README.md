# grunt-cache-control

> Control cache for your Javascript and CSS in one step with this easy to use plugin. When maintaining an application, often we need to update the code and when we do, one of our clients or customer's often complains they do not see the changes and we have to explain to them how to clear their cache.  This is not good.  By appending a ?v=1.0 or something similar to the end of all our script and link tags, we can trick the browser into thinking it's a new file and it will fetch a new version once and then continue caching until we provide a new version with ?v=1.1 or something different. This plugin automates that so you don't have to manually go through your html page and update all the references yourself. Here is an intersting link explaining the benefits and reasons you may want to do this. <a href='http://www.impressivewebs.com/force-browser-newest-stylesheet/' target='_blank'>http://www.impressivewebs.com/force-browser-newest-stylesheet/</a>

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```
npm install grunt-cache-control --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```
grunt.loadNpmTasks('grunt-cache-control');
```

## The "cache_control" task

### Overview
In your project's Gruntfile, add a section named `cache_control` to the data object passed into `grunt.initConfig()`.

```
cache_control: {
  your_target: {
    source: "test/index.html",
    options: {
      version: "2.0",
      links: true,
      scripts: true,
      replace: false,
      outputDest: "test/index2.html",
      dojoCacheBust: true
    }
  }
}
```

## Options

#### source
Type: `String`
Default Value: `none`

A path to a html file that you want the plugin to work with.  If you do not provide a valid filepath then the plugin will terminate with a fatal error telling you the source file was not found. If the file provided does not end in .html or .htm then it will terminate with an error stating the source file needs to end with .html or .htm.  If there is a need to work with other file types contact me and I will look into it. 

#### options.version
Type: `String`
Default value: `'1.0'`

The version number that will appended to your files.

#### options.links
Type: `bool`
Default value: `true`

Tells the plugin to append the version number to all link tags with `rel="stylesheet"`.

#### options.scripts
Type: `bool`
Default value: `true`

Tells the plugin to append the version number to all script tags with a src attribute.

#### options.replace
Type: `bool`
Default value: `true`

Tells the plugin to override whichever file you provided as the source.

#### options.ignoreCDN
Type: `bool`
Default value: `true`

Tells the plugin to not append a version number to files that start with http, https, or //.  So for example, the following would be ignored.<br>
`http://js.arcgis.com/3.8/`<br>
`https://js.arcgis.com/3.8/`<br>
`//js.arcgis.com/3.8/`

#### options.fileToIgnore
Type: `array`
Default value: `[]`

Array of string filenames that you would like the version number to <b>not</b> be appended to.

#### options.outputDest
Type: `String`
Default value: `none`

Mandatory if options.replace is set to false.  Otherwise this does not need to be specified. If options.replace is set to false, this is where the plugin will output the updated html page.  The file does not need to be created so specifying something like `test/index2.html` will create/overwrite index2.html in the test directory. 

#### options.dojoCacheBust
Type: `bool`
Default value: `false`

If you are using dojo and have djConfig or dojoConfig object set up using `cacheBust: true`, this will replace the true with the version number.  Setting cacheBust to true appends a unix timestamp to the end of every module you are requiring via dojo which means the browser will never cache your module as it always looks different.  This is great for development but in production you want the browser to cache unless there is new code.  Setting this to true, as mentioned, tells dojo to append a version number to the modules instead of a timestamp so when the version number changes, the browser will grab all the latest changes but it will cache after that giving you the benefit of caching without having to explain to your clients how to clear their cache to get the latest version. 


## Usage Examples

#### Options 

In this example, I am appending the version number "2.0" to all script tags, link tags, and to my dojoConfig object setup in a script tag.  I am also telling it not to override the source file but instead write a new one out to `test/index2.html`.  Some other settings are the ignoreCDN is true, which will ignore script and link tags starting with http, https, or //.  I also have a file in my filesToIgnore property so it will not append a verison number to `test/testIgnore.js`.

```
grunt.initConfig({
  cache_control: {
    your_target: {
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
  }
});
```

##### Here is what a sample source file looks like.
```
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>

  <link href="test.css?v=1.1" rel="stylesheet" />
  <link href="test1.css?v=1.4" rel="stylesheet" />
  <link href="test2.css" rel="stylesheet" />
  <link href="test3.css" rel="stylesheet" />
  <link href="test4.css" rel="stylesheet" />

  <script src="sample.js?v=1.4"></script>
  <script src="sample1.js"></script>
  <script src="sample2.js"></script>
  <script src="sample3.js"></script>
  <script src="sample4.js"></script>

  <script>
    var dojoConfig = {
      parseOnLoad: false,
      isDebug: false,
      async: true,
      cacheBust: true,
      packages: [
        {name: "utils", location: location.pathname.replace(/\/[^/]+$/, "") + "/app/utils"}
      ]
    };
  </script>

  <!-- This file should be ignored as it is in the ignore list -->
  <script src="test/testIgnore.js"></script>

  <script src="http://js.arcgis.com/3.8/"></script>

  <!-- This syntax will match the protocol being used so it works with http ot https -->
  <script src="//js.arcgis.com/3.8/"></script>


</head>
<body>

  <script src="anotherSample3.js"></script>
  <script src="anotherSample4.js"></script>
</body>
</html>
```
##### Here is what the output file looks like.
```
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>

  <link href="test.css?v=2.0" rel="stylesheet" />
  <link href="test1.css?v=2.0" rel="stylesheet" />
  <link href="test2.css?v=2.0" rel="stylesheet" />
  <link href="test3.css?v=2.0" rel="stylesheet" />
  <link href="test4.css?v=2.0" rel="stylesheet" />

  <script src="sample.js?v=2.0"></script>
  <script src="sample1.js?v=2.0"></script>
  <script src="sample2.js?v=2.0"></script>
  <script src="sample3.js?v=2.0"></script>
  <script src="sample4.js?v=2.0"></script>

  <script>
    var dojoConfig = {
      parseOnLoad: false,
      isDebug: false,
      async: true,
      cacheBust: "v=2.0",
      packages: [
        {name: "utils", location: location.pathname.replace(/\/[^/]+$/, "") + "/app/utils"}
      ]
    };
  </script>

  <!-- This file should be ignored as it is in the ignore list -->
  <script src="test/testIgnore.js"></script>

  <script src="http://js.arcgis.com/3.8/"></script>

  <!-- This syntax will match the protocol being used so it works with http ot https -->
  <script src="//js.arcgis.com/3.8/"></script>


</head>
<body>

  <script src="anotherSample3.js?v=2.0"></script>
  <script src="anotherSample4.js?v=2.0"></script>
</body>
</html>
```

## Important Note
If you are unsure how this will work in your project.  I recommend for the first time you test on your source file that you set replace to false and give a outputDest to write the results to. This way if it does something you were not expecting then you will still have a copy of your original html file. If everything seems to work well and you want to replace your original file then go ahead and set replace to true.  <b>Just remember, replace by default is true so unless you set it to false, even if you do not specify it at all, it will overwrite your previous file.</b>

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).