module.exports = function(config){
	config.set({

		basePath : 'app/',

		files : [
			'bower_components/angular/angular.js',
			'bower_components/angular-route/angular-route.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'components/**/*.js',
			'components/**/*.html',
			'view*/**/*.js'
		],
		
		// enables the usage of HTML templates in Karma tests
		preprocessors: {
			'components/**/*.html': ['ng-html2js']
		},
		
		ngHtml2JsPreprocessor: {
			moduleName: 'templates'
		},

		autoWatch : true,

		frameworks: ['jasmine'],

		browsers : ['Chrome'],

		plugins : [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine',
			'karma-junit-reporter',
			'karma-ng-html2js-preprocessor'
		],

		junitReporter : {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		}

	});
};
