'use strict';

var path = require('path');
var fs   = require('fs');

function EmberCLIFiltertable(project) {
  this.project = project;
  this.name    = 'Ember CLI Filter Table';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberCLIFiltertable.prototype.treeFor = function treeFor(name) {
  var treePath =  path.join('node_modules', 'ember-cli-filtertable', name + '-addon');

  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberCLIFiltertable.prototype.included = function included(app) {
  this.app = app;

  this.app.import('bower_components/ember-cli-filtertable/styles/style.css');
};

module.exports = EmberCLIFiltertable;
