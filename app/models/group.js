import DS from 'ember-data';

var Group = DS.Model.extend({
  name: DS.attr('string'),
  children: DS.hasMany('group', {inverse: 'parent'}),
  parent: DS.belongsTo('group', {inverse: 'children'}),
  depth: DS.attr('number'),
  hasChildren: function() {
    return this.get('_data.children.length') > 0 || false;
  }.property('children'),
  childNum: function() {
    return this.get('_data.children.length') || 0;
  }.property('children')
});

Group.reopenClass({
  FIXTURES: [
    {id: 1, name: "Single", depth: 1},
    {id: 2, name: "Parent of 2", children: [3,4], depth: 1},
    {id: 3, name: "Child 1", depth: 2, children: [5], parent: 2},
    {id: 4, name: "Child 2", depth: 2, parent: 2},
    {id: 5, name: "Sub-child 1", depth: 3, parent: 3}
  ]
});

export default Group;
