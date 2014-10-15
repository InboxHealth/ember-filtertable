module.exports = {
  name: 'ember-cli-filtertable-inbox-health',
  included: function(app) {
    this._super.included(app);
    app.import('vendor/filtertable.css');
  }
};
