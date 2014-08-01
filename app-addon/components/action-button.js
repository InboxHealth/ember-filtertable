import Em from 'ember';

export default Em.Component.extend({
  tagName: 'button',
  classNames: ['btn'],
  classNameBindings: ['selectedClass'],
  attributeBindings: ['isDisabled:disabled'],
  isDisabled: function() {
    return this.get('isButtonActive') === false;
  }.property('isButtonActive'),
  selectedClass: function() {
    var c = (this.get('isButtonActive') === true) ?
           this.get('activeClass') : 'btn-default';
    if (this.get('hash.isSet') === true) {
      c += ' active';
    }
    return c;
  }.property('isButtonActive', 'hash.isSet'),

  /* User variables */
  activeClass: function() {
    if (!Em.isBlank(this.get('hash.activeClass'))) {
      return this.get('hash.activeClass');
    }
    return 'btn-primary';
  }.property('hash'),
  isButtonActive: function() {
    var key = this.get('buttonToggleName');
    return Em.isBlank(key) ? true : this.get(key);
  }.property('targetObject.selectedRecords.@each'),
  buttonToggleName: function() {
    if (Em.isBlank(this.get('isActive'))) {
      Em.debug("No isActive function for action button %@".fmt(this.get('title')));
      return null;
    }
    var activeFn = 'targetObject.%@'.fmt(this.get('isActive'));
    if (!Em.isBlank(this.get(activeFn))) {
      return activeFn;
    }
    activeFn = 'targetObject.%@'.fmt(activeFn);
    // custom handler on controller
    if (!Em.isBlank(this.get(activeFn))) {
      return activeFn;
    }
    // no handler found
    return null;
  }.property(),
  hasGlyph: function() {
    return (!Em.isBlank(this.get('glyphicon')));
  }.property('glyphicon'),
  action: function() {
    if (!Em.isBlank(this.get('hash.action'))) {
      return this.get('hash.action');
    }
    return null;
  }.property('hash'),
  click: function() {
    if (Em.isBlank(this.get('action'))) {
      Em.debug("No action defined for " + this.get('title'));
      alert("Not yet implemented");
      return;
    }
    // Actions are defined on the controller, which is the parent of the
    // filter table component, which is the parent of this button
    this.get('targetObject').get('targetObject').send(this.get('action'));
  }
});
