import Em from 'ember';
export default Em.ArrayController.extend({
  sortOptions: [{id: 1, name:'Name asc'}, {id:2, name:'Name desc'}],
  selectedSortOption: null,

  /* Dropdown filters are specific to the implementer. To enable the filter,
   * we simply make the component call our filter method and update the records
   */
  sortTable: function() {
    Em.debug("Sorting table records");
  }.observes('selectedSortOption'),
  customBtnActive: function() {
    //Handler to set isActive on custom button
    return this.get('selectedRecords.length') === 2;
  }.property('selectedRecords.@each'),
  actions: {
    clickedNone: function() {
      Em.debug("Clicked on NONE button");
    },
    clickedOne: function() {
      Em.debug("Clicked on ONE button");
    },
    clickedMany: function() {
      Em.debug("Clicked on MANY button");
    },
    clickedCustom: function() {
      Em.debug("Clicked on CUSTOM button");
    },
    removeRow: function(record) {
      Em.debug("Removing selected record");
      this.get('content').removeObject(record);
      record.destroy();
    }
  }
});
