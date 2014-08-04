#Ember CLI Filter Table

__Note__: This is very much still a work in progress. Use at own risk

## Description
This component is an Ember CLI add-on which presents a standard html table but allows for extra options. It includes a text input box for easy filtereing, as well as hooks for dropdown filtering. It also allows for extra buttons in the header which can activate/deactivate based on selections in the table.

## Installation
npm install ember-cli-filtertable --save-dev

##Basic Usage

  {{filter-table content=content bodyTemplate="mytable-body" headerTemplate="mytable-header"}}

## Options
When calling the filter table, the following options are available:

### General Options

#### viewLimit
Type: `Number`
Default: `20`

This is the number of maximum records that will be shown in the table.

#### columnNum
Type: `Number`
Default: `2`

This is the number of columns within the table. It is needed to calculate the
header colspan attribute.

#### selectedRecords
Type: `Array`
Default: `selectedRecords`

This option is only needed when implementing logic that needs to know how many
records are selected. By default, it will use the `selectedRecords` field on
the controller if it hasn't been defined at startup.

### Text Filter Options

#### showTextFilter
Type: `Boolean`
Default: `true`

Either show or hide the text input for record filtering in the header

#### filterField
Type: `String`
Default: `name`

The field in each record on which to apply the text filtering

### Checkbox options

#### showCheckboxes
Type: `Boolean`
Default: `true`

This will show the _select all_ checkbox in the header. It is a convenience checkbox to allow for quick selecting of the whole visible record set

#### toggleSelected
Type: `Boolean`
Default: `false`

By default no records are selected, but setting this to true will mark all visible records as selected.

## Table rows
Since table rows aren't called directly anymore, but rather via the component,
any defined actions won't actually call the controller.  We've added 5 proxies
to the component which will call an action on the component. They are called:

    submit, remove, action1, action2, action3

To get them to work correctly, you'll need to define the action as follows:


    <td {{action "remove" "removeRow" r}}>(remove)</td>

That definition will call the `removeRow` action on the controller with the
current record.
