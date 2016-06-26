// Karma configuration
module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    //basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      '../bower_components/jquery/dist/jquery.js',
      '../bower_components/angular/angular.js',
      '../bower_components/firebase/firebase.js',
      '../bower_components/angularfire/dist/angularfire.js',
      '../bower_components/bootstrap/dist/js/bootstrap.js',
      '../bower_components/angular-route/angular-route.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      '../bower_components/google-maps-utility-library-v3-markerwithlabel/dist/markerwithlabel.js',
      '../bower_components/google-maps-utility-library-v3-infobox/dist/infobox.js',
      '../bower_components/google-maps-utility-library-v3-keydragzoom/dist/keydragzoom.js',
      '../bower_components/js-rich-marker/src/richmarker.js',
      '../bower_components/angular-google-maps/dist/angular-google-maps.js',
      '../bower_components/flexslider/jquery.flexslider.js',
      '../bower_components/FlexSlider/jquery.flexslider.js',
      '../bower_components/angular-flexslider/angular-flexslider.js',
      '../bower_components/angular-strap/dist/angular-strap.js',
      '../bower_components/angular-strap/dist/angular-strap.tpl.js',
      '../bower_components/angular-messages/angular-messages.js',
      '../bower_components/ng-notify/src/scripts/ng-notify.js',
      // endbower
      '../app/scripts/**/*.js',
      //'../test/mock/**/*.js',
      '../test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
