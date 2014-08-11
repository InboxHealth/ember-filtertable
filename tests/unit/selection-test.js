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
    c.get('filteredRecords')[0].set('selected', true);
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
    c.get('filteredRecords')[0].set('selected', true);
    c.get('filteredRecords')[1].set('selected', true);
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
    c.get('filteredRecords')[0].set('selected', true);
    c.get('filteredRecords')[1].set('selected', true);
  });
  equal(c.get('selectedRecords.length'), 2);
  ok(c.get('oneOrMoreSelected'));
  ok(c.get('allSelected'));
});

test('Select-all then deselect all', function() {
  expect(10);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(3));
  });
  equal(c.get('selectedRecords.length'), 0, "No records in selectedRecords");
  ok(c.get('noneSelected'), "noneSelected property checked");
  ok(!c.get('allSelected'), "allSelected property unchecked");
  Em.run(function() {
    c.set('selectAll', true);
  });
  equal(c.get('selectedRecords.length'), 3, "All records selected");
  ok(!c.get('noneSelected'), "noneSelected property unchecked");
  ok(c.get('allSelected'), "allSelected property checked");
  Em.run(function() {
    c.set('selectAll', false);
  });
  equal(c.get('selectedRecords.length'), 0, "No records selected");
  ok(c.get('noneSelected'), "noneSelected property checked");
  ok(!c.get('allSelected'), "allSelected property unchecked");
  ok(!c.get('allSelected'));
});

test('Select-all when hidden records are selected', function() {
  expect(10);
  var c = this.subject(),
      content = getContent(1),
      fr = null;
  content.pushObject(Em.Object.create({name: 'matching'}));
  Em.run(function() {
    c.set('content', content);
  });
  Em.run(function() {
    // todo: select record in view, then change filter, then do the test
    c.get('filteredRecords')[0].set('selected', true);
    c.set('textFilter', 'matc');
  });
  fr = c.get('filteredRecords');
  equal(fr.get('length'), 1, "Only one record visible");
  ok(!fr[0].get('selected'), "Visible record unselected");
  ok(c.get('content')[0].get('selected'), "Invisible record selected");
  ok(!c.get('oneOrMoreSelected'), "oneOrMoreSelected false");
  ok(c.get('noneSelected'), "noneSelected true");
  Em.run(function() {
    c.toggleAllSelection();
    c.set('selectAll', true);
  });
  fr = c.get('filteredRecords');
  ok(c.get('allSelected'), "allSelected true");
  ok(!c.get('noneSelected'), "noneSelected false");
  ok(c.get('oneOrMoreSelected'), "oneOrMoreSelected true");
  ok(fr[0].get('selected'), "Visible record selected");
  ok(!c.get('content')[0].get('selected'), "Invisible record unselected");
});

test('Select-all checkbox gets automatically toggled', function() {
  expect(4);
  var c = this.subject(),
      content = getContent(2);
  Em.run(function() {
    c.set('content', content);
  });
  Em.run(function() {
    c.get('filteredRecords')[0].set('selected', true);
  });
  ok(!c.get('selectAll'), "Select-all checkbox not checked");
  Em.run(function() {
    c.get('filteredRecords')[1].set('selected', true);
  });
  ok(c.get('selectAll'), "Select-all checkbox checked");
  ok(c.get('allSelected'), "All records are selected");
  Em.run(function() {
    c.get('filteredRecords')[0].set('selected', false);
  });
  ok(!c.get('selectAll'), "Select-all checkbox not checked");
});

test('Deselect-all while none selected', function() {
  expect(4);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(3));
  });
  equal(c.get('selectedRecords.length'), 0, "No records selected");
  Em.run(function() {
    c.set('deselectAll', true);
  });
  equal(c.get('selectedRecords.length'), 0);
  ok(!c.get('allSelected'), "No records selected");
  ok(!c.get('deselectAll'), "deselectAll set to false");
});

test('Deselect-all while all selected', function() {
  expect(3);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(3));
  });
  Em.run(function() {
    c.set('selectAll', true);
  });
  ok(c.get('allSelected'), "All records selected");
  Em.run(function() {
    c.set('deselectAll', true);
  });
  ok(c.get('noneSelected'), "No records selected");
  ok(!c.get('deselectAll'), "deselectAll set to false");
});

test('Deselect-all while some records are selected', function() {
  expect(4);
  var c = this.subject();
  Em.run(function() {
    c.set('content', getContent(2));
  });
  Em.run(function() {
    c.get('filteredRecords')[0].set('selected', true);
  });
  ok(!c.get('allSelected'), "allSelected false");
  ok(!c.get('noneSelected'), "noneSelected false");
  Em.run(function() {
    c.set('deselectAll', true);
  });
  ok(c.get('noneSelected'), "No records selected");
  ok(!c.get('deselectAll'), "deselectAll set to false");
});
