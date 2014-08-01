import Em from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';

Em.MODEL_FACTORY_INJECTIONS = true;

var App = Em.Application.extend({
  modulePrefix: 'ember-cli-filtertable', // TODO: loaded via config
  Resolver: Resolver
});

loadInitializers(App, 'ember-cli-filtertable');

export default App;
