# Introduction

The Idea of this component is to have a simple & extendable table component with no dependencies.

## Features:

- group data
- sort non-grouped & grouped data
- hide/show columns
- select data
- row click action
- column customization options
- custom external column templates
- grouping header customization

## CSS Config

Table theme can be changed using `::ng-deep` from outside or by changing one of these css variables **on the table host
element**.

### Table

```
--et-table-border: #797575;
--et-table-border-radius: 10px 10px 0 0;
--et-table-font: 500;
```

### header row

```
--et-header-row-fw: 600; // font-weight
--et-header-row-bg: #797575;
```

### group row

```
--et-group-row-bg: #797575;
--et-group-row-hover-bg: #797575;
--et-group-spacing: 16px;
```

### data row

```
--et-data-row-hover-bg: #797575;
--et-data-row-padding: 0; // 0 12px
--et-data-row-status-color: transparent;
--et-data-row-status-width: 4px;
--et-data-row-status-height: 60%;
--et-data-row-status-left: -5px;
--et-data-row-status-top: 20%;
--et-data-row-status-border: 2px 0 0 2px;
```

### cells

```
--et-header-cell-padding: 12px;
--et-cell-padding: 12px;
```

### checkbox

```
--et-checkbox-content-checked: '\2713';
--et-checkbox-content-indeterminate: '\2212';
--et-checkbox-bg: white;
--et-checkbox-border: black;
--et-checkbox-color: black;
```

### sorting

```
--et-sort-content: '\276E';
```

### utils

```
--et-min-cell-width: 6ch;
--et-margin-left: 0.5rem;
--et-margin-right: 0.5rem;
--et-margin-inline: 0.5rem;
```

## Note:

For simplicity, this component **doesn't include any complex conditional logic** on columns or rows as this can
be done through the table configuration from outside the component. This also include other features like **pagination**
.
