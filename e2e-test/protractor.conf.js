exports.config = {
    allScriptsTimeout: 11000,
    specs: [ '*.js' ],
    // capabilities: { 'browserName': 'chrome' },

    multiCapabilities: [
        /*
        {   'browserName': 'phantomjs',
            'phantomjs.binary.path': './node_modules/phantomjs/bin/phantomjs',
            'phantomjs.cli.args': ['--logfile=PATH', '--loglevel=DEBUG']  
        }, 
        */
        {   'browserName': 'firefox'  }, 
        {   'browserName': 'chrome' }
    ],

    baseUrl: 'http://localhost:5000',
    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },

    onPrepare: function() {
        //fails: needs investigation
        /* if (process.env.TEAMCITY_VERSION) {
            require('jasmine-reporters');
            jasmine.getEnv().addReporter(new jasmine.TeamcityReporter());
        }
        */
    }
};