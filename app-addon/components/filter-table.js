import Em from 'ember';

export default Em.Component.extend({
  /* System settings */
  layoutName: 'components/filter-table-layout',
  selectedRecords: Em.A([]),
  updateSelectedRecords: function() {
    var sr = this.get('selectedRecords');
    sr.clear();
    sr.addObjects(this.get('filteredRecords').filterBy('selected', true));
    return sr;
  }.observes('filteredRecords.@each.selected'),
  loadSelectedRecordsOnController: function() {
    var to = this.get('targetObject');
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
  allSelected: false,
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

  filterOptions: Em.A([]),  // Filter options for the table (dropdown) in (text,query) format
  selectedFilter: null, // Currently selected dropdown option
  filteredRecords: Em.A([]), // Displayed records
  toggleAllSelection: function() {
    var selected = this.get('allSelected'),
        records = this.get('filteredRecords');
    Em.run.once(function() {
      records.forEach(function(r) {
        r.set('selected', selected);
      });
    });
  }.observes('allSelected'),
  hasNoFilteredRecords: function() {
    return this.get('filteredRecords.length') < 1;
  }.property('filteredRecords.@each'),
  hasNoActualRecords: function() {
    return this.get('content').get('length') < 1;
  }.property('content.@each'),
  deselectAll: function() {
    if (this.get('allSelected') === false) {
      this.toggleAllSelection();
    } else {
      this.set('allSelected', false);
      Em.$('thead:first th:first input').prop('checked', false);
    }
  },
  recordsSelected: function() {
    return this.get('selectedRecords').get('length') > 0;
  }.property('selectedRecords'),
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
    var ac = this.get('arrangedContent') || this.get('content.arrangedContent');
    if (Em.isEmpty(ac)) {
      this.set('filteredRecords', []);
      return;
    }
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
    Em.run.once(this, 'loadRecords');
  }.on('init').observes('content.@each')
});
