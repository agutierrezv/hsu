module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'public/lib/jquery.2.1.1.min.js',
      'public/lib/bootstrap.3.2.0.min.js',
      'public/lib/angular.1.3.14.min.js',
      'public/lib/angular-route.1.3.14.min.js',
      'public/lib/angular-sanitize.1.3.14.min.js',
      'public/lib/angular-animate.1.3.14.min.js',
      'public/lib/angular-cookies.1.3.14.min.js',
      'public/lib/angular-locale_es-es.1.3.x.js',
      'public/lib/ui-bootstrap-tpls.0.11.0.min.js',
      'public/lib/autocomplete.js',
      'public/lib/ng-map.min.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/app/**/*.js',
      'public/app/app.js'
    ],

    exclude: [
      'public/app/dist/xlsx.full.min.js'
    ],

    autoWatch : true,
    colors: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],
    //browsers : ['Chrome'],  
    //browsers : ['Chrome','PhantomJS', 'Firefox'],  
    //browsers : ['Chrome','PhantomJS'],  

    plugins : [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            //'karma-teamcity-reporter',
            'karma-coverage'            
            ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        // do not include tests or libraries
        // (these files will be instrumented by Istanbul)
        'public/app/controllers/**/*.js': 'coverage',
        'public/app/directives/**/*.js':  'coverage',
        'public/app/filters/**/*.js':     'coverage',
        'public/app/services/**/*.js':    'coverage',
        'public/app/app.js':              'coverage'
    },

    reporters: [ //'teamcity',
                 'progress',
                 'junit', 
                 'coverage', ],

    // configure the reporter
    coverageReporter: {
            reporters: [
                { type: 'html' }
                //,
                //{ type: 'teamcity' }
            ]
        },


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    //logLevel: config.LOG_DEBUG,

    //loggers: [{type: 'console'}],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};