/* This tests the selection logic.
 */
import Em from 'ember';
import FilterTable from '../../components/filter-table';
import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('filter-table', 'selection');

var getContent = function(num) {
  var content = Em.A([]);
  for (var i=0; i < num; i++) {
    content.push(Em.Object.create({name: "same name"}));
  }
  return content;
};

test('Select all then deselect all', function() {
  expect(6);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(3));
  });
  equal(c.get('selectedRecords.length'), 0);
  ok(c.get('noneSelected'));
  Em.run(function() {
    c.toggleAllSelection();
  });
  equal(c.get('selectedRecords.length'), 3);
  ok(c.get('allSelected'));
  Em.run(function() {
    c.toggleAllSelection();
  });
  equal(c.get('selectedRecords.length'), 0);
  ok(!c.get('allSelected'));
});

test('Explicit deselect all while none selected', function() {
  expect(3);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(3));
  });
  equal(c.get('selectedRecords.length'), 0);
  Em.run(function() {
    c.deselectAll();
  });
  equal(c.get('selectedRecords.length'), 0);
  ok(!c.get('allSelected'));
});

test('It tests the explicit deselect all while all selected', function() {
  expect(3);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(3));
    c.toggleAllSelection();
  });
  equal(c.get('selectedRecords.length'), 0);
  Em.run(function() {
    c.deselectAll();
  });
  equal(c.get('selectedRecords.length'), 0);
  ok(!c.get('allSelected'));
});

test('select all when hidden records are selected', function() {
  expect(8);
  var c = this.subject(),
      content = getContent(1);
  content.pushObject(Em.Object.create({name: 'matching'}));
  Em.run(function() {
    c.set('content', content);
  });
  Em.run(function() {
    // todo: select record in view, then change filter, then do the test
    c.get('filteredRecords')[0].set('selected', true);
    c.set('textFilter', 'matc');
  });
  ok(content[0].get('selected'));
  ok(!content[1].get('selected'));
  ok(!c.get('oneOrMoreSelected'));
  ok(c.get('noneSelected'));
  Em.run(function() {
    c.toggleAllSelection();
  });
  ok(c.get('allSelected'));
  ok(!c.get('noneSelected'));
  ok(content[1].get('selected'));
  ok(!content[0].get('selected'));
});

test('Select one record', function() {
  expect(8);
  var c = this.subject(),
      content = getContent(3);
  Em.run(function() {
    c.set('content', content);
  });
  ok(c.get('noneSelected'));
  ok(!c.get('oneSelected'));
  ok(!c.get('oneOrMoreSelected'));
  equal(c.get('selectedRecords.length'), 0);
  Em.run(function() {
    content[0].set('selected', true);
  });
  equal(c.get('selectedRecords.length'), 1);
  ok(!c.get('noneSelected'));
  ok(c.get('oneSelected'));
  ok(c.get('oneOrMoreSelected'));
});

test('Select two records', function() {
  expect(5);
  var c = this.subject(),
      content = getContent(3);
  Em.run(function() {
    c.set('content', content);
  });
  Em.run(function() {
    content[0].set('selected', true);
    content[1].set('selected', true);
  });
  equal(c.get('selectedRecords.length'), 2);
  ok(!c.get('noneSelected'));
  ok(!c.get('oneSelected'));
  ok(c.get('oneOrMoreSelected'));
  ok(!c.get('allSelected'));
});

test('Select all records explicitly', function() {
  expect(3);
  var c = this.subject(),
      content = getContent(2);
  Em.run(function() {
    c.set('content', content);
  });
  Em.run(function() {
    content[0].set('selected', true);
    content[1].set('selected', true);
  });
  equal(c.get('selectedRecords.length'), 2);
  ok(c.get('oneOrMoreSelected'));
  ok(c.get('allSelected'));
});
