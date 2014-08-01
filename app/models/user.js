import DS from 'ember-data';

var User = DS.Model.extend({
  name: DS.attr('string'),
  surname: DS.attr('string'),
  email: DS.attr('string'),
  fullName: function() {
    return "%@ %@".fmt(this.get('name'), this.get('surname'));
  }.property('name', 'surname')
});

User.reopenClass({
  FIXTURES: [
    {id: 1, name: "Andrew", surname: "Zimba", email: "andrew@ft.example.com"},
    {id: 2, name: "Betty", surname: "Xaru", email: "betty@ft.example.com"},
    {id: 3, name: "Charles", surname: "Wu", email: "charles@ft.example.com"},
    {id: 4, name: "Dianna", surname: "Vice", email: "dianna@ft.example.com"},
    {id: 5, name: "Eddie", surname: "Upton", email: "eddie@ft.example.com"},
    {id: 6, name: "Frieda", surname: "Tonton", email: "frieda@ft.example.com"},
    {id: 7, name: "Graeme", surname: "Smith", email: "graeme@ft.example.com"}
  ]
});

export default User;
