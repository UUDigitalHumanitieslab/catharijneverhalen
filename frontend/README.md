# The Angular-based frontend

This directory is a Node/Bower/Angular project, based on [angular-seed](https://github.com/angular/angular-seed).


## Configuration

There is a source file deliberately missing from VCS, which you should add yourself. Create a file `app/components/googleMaps/googleMaps-apiKey.js` with the following content:

    'use strict';

    angular.module('catharijne.googleMaps.apiKey', [])
    .constant('appGmapiKey', '... your API key here ...');

This is a bit of a hacky way to have the Google Maps API key available at configuration time without needing to keep it in VCS.

`bower.json`, `karma.conf.js` and `package.json` contain configuration values that you may wish to update.

There is a `.travis.yml` stub, which should probably be moved to the project root directory before use. It will need extensive editing to also include the backend.


## Dependencies

First of all, you need to have [NodeJS](http://nodejs.org/) installed.

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
angular-seed changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*


## Running the Application during development

While there is a webserver available from within Node, you should run the development server from the backend instead. See `/backend/Readme.md` for instructions. TLDR:

    cd ../backend
    # (activate your virtualenv if not done already)
    python manage.py runserver --settings=settings
    cd -  # back to this directory


## Testing

There are two kinds of tests in the application: Unit tests and End to End tests.

### Running Unit Tests

The unit tests are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-once
```


### End to end testing

The end-to-end tests are also written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.
Again, you should use the backend development server for this purpose.

    cd ../backend
    # (activate your virtualenv if not done already)
    python manage.py runserver --settings=settings
    cd -  # back to this directory

In addition, since Protractor is built upon WebDriver we need to install this.  The project comes with a predefined script to do this:

```
npm run update-webdriver
```

This will download and install the latest version of the stand-alone WebDriver tool.

Once you have ensured that the development web server hosting our application is up and running
and WebDriver is updated, you can run the end-to-end tests using the supplied npm script:

```
npm run protractor
```

This script will execute the end-to-end tests against the application being hosted on the
development server.

### Starting all tests at once

    npm run test-all  # equivalent to `npm run test-once ; npm run protractor`


## Updating Angular

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.


[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[jasmine]: http://jasmine.github.io
[karma]: http://karma-runner.github.io
[travis]: https://travis-ci.org/
[http-server]: https://github.com/nodeapps/http-server
