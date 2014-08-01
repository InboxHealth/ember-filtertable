import Em from 'ember';

export default Em.Component.extend({
  /* System settings */
  layoutName: 'components/filter-table',
  selectedRecords: Em.A([]),
  updateSelectedRecords: function() {
    var sr = this.get('selectedRecords'),
        fr = this.get('filteredRecords');
    Em.run.once(function() {
      sr.clear();
      sr.addObjects(fr.filterBy('selected', true));
      Em.debug("Selected: %@".fmt(sr.get('length')));
    });
  }.observes('filteredRecords.@each.selected'),
  loadSelectedRecordsOnController: function() {
    var to = this.get('targetObject');
    if (to === undefined || to === null) {
      Em.debug("WARNING: no target object found. Are we testing?");
      return;
    }
    if (Em.isBlank(to.get('selectedRecords'))) {
      this.set('targetObject.selectedRecords', this.get('selectedRecords'));
    }
  }.on('init'),
  /* General table settings */
  viewLimit: 20,
  columnNum: 2,
  headerFilterColspan: function() {
    var diff = (this.get('showCheckboxes')) ? 1 : 0;
    return this.get('columnNum') + diff;
  }.property('columnNum'),
  /* Elements pertaining to the input box used for filtereing results */
  showTextFilter: true,
  textFilter: "",  // The search bar at the top for filtering
  filterField: 'name',

  /* Checkbox select/deselect all logic */
  showCheckboxes: true,
  noneSelected: function() {
    return this.get('selectedRecords.length') < 1;
  }.property('selectedRecords.@each'),
  oneSelected: function() {
    return this.get('selectedRecords.length') === 1;
  }.property('selectedRecords.@each'),
  oneOrMoreSelected: function() {
    return this.get('selectedRecords.length') > 0;
  }.property('selectedRecords.@each'),
  allSelected: function() {
    return this.get('selectedRecords.length') ===
           this.get('filteredRecords.length');
  }.property('selectedRecords.@each', 'filteredRecords.@each'),

  filterOptions: Em.A([]),  // Filter options for the table (dropdown) in (text,query) format
  selectedFilter: null, // Currently selected dropdown option
  filteredRecords: Em.A([]), // Displayed records
  toggleAllSelection: function() {
    // If any filtered records are selected, it deselects all,
    // else it selects all filtered records. If records that are not visible
    // are selected, then they are unselected in the background
    var fRecords = this.get('filteredRecords'),
        sRecords = this.get('selectedRecords'),
        aRecords = this.get('content').filterBy('selected', true);
    Em.run.once(function() {
      // if any records are selected, we deselect all selected records
      if (sRecords.get('length') > 0) {
        aRecords.forEach(function(r) {
          r.set('selected', false);
        });
      } else {
        if (aRecords.get('length') > 0 && sRecords.get('length') < 1) {
          // deselect hidden records before we select all visible records
          aRecords.forEach(function(r) {
            r.set('selected', false);
          });
        }
        fRecords.forEach(function(r) {
          r.set('selected', true);
        });
      }
    });
  }.observes('toggleSelection'),
  hasNoFilteredRecords: function() {
    return this.get('filteredRecords.length') < 1;
  }.property('filteredRecords.@each'),
  hasNoActualRecords: function() {
    return this.get('content').get('length') < 1;
  }.property('content.@each'),
  deselectAll: function() {
    var sRecords = this.get('selectedRecords');
    if (sRecords.get('length') > 1) {
      this.toggleAllSelection();
    } else {
      Em.run.once(function() {
        // mark visible records as selected
        sRecords.forEach(function(r) {
          r.set('selected', false);
        });
      });
      Em.$('thead:first th:first input').prop('checked', false);
    }
  },
  applyTextFilter: function(ac) {
    var filter = this.get('textFilter');
    if (!Em.isBlank(filter)) {
      Em.debug("Applying text filter to records");
      filter = filter.toLowerCase();
      var ff = this.get('filterField');
      ac = ac.filter(function(record) {
        if (Em.isBlank(record) || Em.isBlank(record.get(ff))) {
          return false;
        }
        return record.get(ff).toLowerCase().indexOf(filter) > -1;
      });
    }
    return ac;
  },
  applyDropdownFilter: function(ac) {
    Em.debug("No implemented dropdown filter");
    return ac;
  },
  loadRecords: function() {
    Em.debug('Refreshing visible records');
    var ac = this.get('arrangedContent') ||
             this.get('content.arrangedContent') ||
             this.get('content');
    if (Em.isEmpty(ac)) {
      this.set('filteredRecords', []);
      return;
    }
    ac = ac.toArray();  // make copy of the content record
    ac = this.applyTextFilter(ac);
    ac = this.applyDropdownFilter(ac);
    Em.debug("Showing filteredRecords");
    if (ac.get('length') > this.get('viewLimit')) {
      Em.debug("\tChopping records to viewLimit");
      ac = ac.splice(0, this.get('viewLimit'));
    }
    this.set('filteredRecords', Em.A(ac));
  }.observes('textFilter', 'selectedFilter', 'filterOptions.@each.selection'),
  loadOnContentChange: function() {
    if (Em.isEmpty(this.get('content'))) {
      return;
    }
    Em.run.once(this, 'loadRecords');
  }.on('init').observes('content.@each')
});
