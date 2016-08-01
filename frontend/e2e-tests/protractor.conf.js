exports.config = {
	allScriptsTimeout: 11000,

	specs: [
		'*.js'
	],

	multiCapabilities: [{
		'browserName': 'chrome'
	}, {
		'browserName': 'firefox'
	}],

	baseUrl: 'http://localhost:8000/app/',

	framework: 'jasmine',

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	}
};
