/* This tests the basic loading and unloading of content along with the
 * text filter.
 */
import Em from 'ember';
import FilterTable from '../../components/filter-table';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('filter-table', 'filtering');

var getContent = function(num) {
  var content = Em.A([]);
  for (var i=0; i < num; i++) {
    content.push(Em.Object.create({name: "same name"}));
  }
  return content;
};

test('It sets filteredRecords to initial content', function() {
  expect(2);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(18));
  });
  equal(c.get('filteredRecords.length'), 18);
  ok(!c.get('hasNoActualRecords'));
});

test('It limit filteredRecords to view limit', function() {
  expect(3);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(21));
  });
  equal(c.get('filteredRecords.length'), c.get('viewLimit'));
  equal(c.get('content.length'), 21);
  ok(!c.get('hasNoActualRecords'));
});

test('It shows no records message', function() {
  expect(2);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(0));
  });
  equal(c.get('filteredRecords.length'), 0);
  ok(c.get('hasNoActualRecords'));
});

test('It filters but has no matching results', function() {
  expect(3);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(1));
  });
  Em.run(function() {
    c.set('textFilter', 'mumboJumbo');
  });
  ok(c.get('hasNoFilteredRecords'));
  ok(!c.get('hasNoActualRecords'));
  equal(c.get('filteredRecords.length'), 0);
});

test('It filters and has one matching result', function() {
  expect(2);
  var c = this.subject(),
      content = getContent(1);
  content.pushObject(Em.Object.create({name: 'matching'}));
  Em.run(function() {
    c.set('content', content);
    c.set('textFilter', 'matc');
  });
  ok(!c.get('hasNoFilteredRecords'));
  equal(c.get('filteredRecords.length'), 1);
});

test('It reloads when content is added', function() {
  expect(2);
  var c = this.subject(),
      content = getContent(3);
  Em.run(function() {
    c.set('content', content);
  });
  equal(c.get('filteredRecords.length'), 3);
  Em.run(function() {
    content.addObject(Em.Object.create({}));
  });
  equal(c.get('filteredRecords.length'), 4);
});
