import {fromColumns} from '../utils/columns-util';
import {TableColumn} from './implementations';
import {TableGrouping} from './table-grouping';
import {
    DisplayedGroupColumns,
    ExtendedTableColumn,
    ExtendedTableDataGroupColumns,
    ExtendedTableGroupByColumns,
    ExtendedTableGroupingConfig,
    ExtendedTableRowData
} from './interfaces';


/** A class that will initialize some table configuration values if they are not provided */
export class TableDataConfig<T> {
    columns: TableColumn<T>[] = [];
    grouping: TableGrouping<T> = new TableGrouping(null);

    get isDataGrouped() {
        return this.grouping.groupByColumns.length > 0;
    }

    setColumns(columns: ExtendedTableColumn<T>[]) {
        this.columns = fromColumns(columns);
        this.grouping = new TableGrouping(this.columns);
    }

    setTableGroupByColumns(groupByColumns: ExtendedTableGroupByColumns<T>) {
        this.grouping.setGroupByColumns(groupByColumns);
    }

    setTableGroupingConfig(groupingOptions: ExtendedTableGroupingConfig<T>) {
        this.grouping.setGroupingConfig(groupingOptions);
    }

    setTableDataGroupColumns(dataGroupColumns: ExtendedTableDataGroupColumns<T>) {
        this.grouping.setDataGroupColumns(dataGroupColumns);
    }

    getDefaultGroupKey(data: ExtendedTableRowData<T>) {
        return this.grouping.getDefaultGroupKey(data);
    }

    getGroupByData(data: ExtendedTableRowData<T>) {
        return this.grouping.groupByColumns.reduce((acc, c) => {
            return {
                ...acc,
                [c.columnId]: data[c.columnId]
            };
        }, {});
    }

    getDisplayedGroupColumns(): DisplayedGroupColumns[] {
        const displayedGroupColumns: DisplayedGroupColumns[] = [];
        displayedGroupColumns.push({
            columnId: '__groupingColumn__',
            getLabel: this.grouping.getGroupLabel,
            width: this.grouping.groupWidth,
            alignContent: this.grouping.alignGroupContent
        });
        for (let col of this.grouping.dataGroupColumns) {
            displayedGroupColumns.push({
                columnId: '__' + col.columnId + '__',
                getLabel: col.getLabel,
                width: col.width,
                alignContent: col.alignContent
            });
        }
        return displayedGroupColumns;
    }
}
