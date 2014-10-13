import Em from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';
import selectOption from './select-option';

export default function startApp(attrs) {
  var App;

  var attributes = Em.merge({}, config.APP);
  attributes = Em.merge(attributes, attrs); // use defaults, but you can override;

  Router.reopen({
    location: 'none'
  });

  Em.run(function() {
    App = Application.create(attributes);
    App.setupForTesting();
    App.injectTestHelpers();
  });

  App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

  return App;
}
