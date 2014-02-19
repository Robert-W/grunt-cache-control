# grunt-cache-control

> Break cache for your Javascript and CSS in one step with this easy to use plugin.

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
      replaceDest: "test/index2.html",
      dojoCacheBust: true
    }
  }
}
```

### Options

#### Options will be coming soon, ignore options.separator, I left in for my reference and will remove it when I have time to update README

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.



### Usage Examples

#### Options (REFERENCE ONLY - Will be removed when I have time to update README)
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

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
        replaceDest: "test/index2.html",
        dojoCacheBust: true
      }
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_Coming Soon_
