import {MatTableWrapperColumn, TableColumn} from './mat-table-wrapper-column';
import {
    MatTableWrapperDataGroupColumns,
    MatTableWrapperGroupByColumns,
    MatTableWrapperGroupingConfig,
    TableGrouping
} from './mat-table-wrapper-grouping';
import {MatTableWrapperRowData} from './mat-table-wrapper-row-data';
import {fromColumns} from '../utils/columns-util';
import {MatTableWrapperDataGroupColumn} from './mat-table-wrapper-data-group-column';

export interface DisplayedGroupColumns {
    /** id of the column */
    columnId: string;
    /** a function to get the label of the column header */
    getLabel: any;
    /** the space taken by the column */
    width: string;
    /** text alignment of the column */
    alignContent: string;
}

/** A class that will initialize some table configuration values if they are not provided */
export class TableDataConfig<T> {
    columns: TableColumn<T>[] = [];
    grouping: TableGrouping<T> = new TableGrouping(null);

    get isDataGrouped() {
        return this.grouping.groupByColumns.length > 0;
    }

    setColumns(columns: MatTableWrapperColumn<T>[]) {
        this.columns = fromColumns(columns);
        this.grouping = new TableGrouping(this.columns);
    }

    setTableGroupByColumns(groupByColumns: MatTableWrapperGroupByColumns<T>) {
        this.grouping.setGroupByColumns(groupByColumns);
    }

    setTableGroupingConfig(groupingOptions: MatTableWrapperGroupingConfig<T>) {
        this.grouping.setGroupingConfig(groupingOptions);
    }

    setTableDataGroupColumns(dataGroupColumns: MatTableWrapperDataGroupColumns<T>) {
        this.grouping.setDataGroupColumns(dataGroupColumns);
    }

    getDefaultGroupKey(data: MatTableWrapperRowData<T>) {
        return this.grouping.getDefaultGroupKey(data);
    }

    getGroupByData(data: MatTableWrapperRowData<T>) {
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
