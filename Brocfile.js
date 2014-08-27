/* global require, module */
var mergeTrees = require('broccoli-merge-trees');

var appTree    = mergeTrees(['app', 'app-addon'], { overwrite: true });
var vendorTree = mergeTrees(['bower_components', 'vendor-addon']);
var templatesTree = mergeTrees(['app/templates', 'templates-addon']);

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  trees: {
    app: appTree,
    vendor: vendorTree,
    templates: templatesTree
  }
});

app.import('bower_components/ember-cli-filtertable/styles/style.css');

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.
app.import('bower_components/bootstrap/dist/css/bootstrap.min.css');

module.exports = app.toTree();
