import {Column, TableColumn} from './column';
import {GroupingConfig, TableGrouping} from './grouping-config';
import {ColumnsUtil} from '../utils/columns-util';

export interface TableConfig {
    columns: Column[];
    grouping?: GroupingConfig;
    getStatusColor?: (data) => string;
}

export interface DisplayedGroupColumns {
    columnId: string;
    getLabel: any;
    width: string;
    alignContent: string;
}

export class TableConfiguration implements TableConfig {
    columns: TableColumn[] = [];
    grouping: TableGrouping = new TableGrouping(null, null);

    constructor(tableOptions: TableConfig) {
        if (tableOptions) {
            this.columns = ColumnsUtil.From(tableOptions.columns);
            this.grouping = new TableGrouping(tableOptions.grouping, this.columns);
        }
    }

    get isDataGrouped() {
        return this.grouping.groupByColumns.length > 0;
    }

    get groupSpacing() {
        return this.grouping.groupSpacing;
    }

    getDefaultGroupKey(data) {
        return this.grouping.getDefaultGroupKey(data);
    }

    getGroupByData(data) {
        return this.grouping.groupByColumns.reduce((acc, c) => {
            return {
                ...acc,
                [c.columnId]: data[c.columnId]
            };
        }, {});
    }

    getDisplayedGroupColumns(): DisplayedGroupColumns[] {
        const visibleColumns: DisplayedGroupColumns[] = [];
        visibleColumns.push({
            columnId: '__groupingColumn__',
            getLabel: this.grouping.getGroupLabel,
            width: this.grouping.groupWidth,
            alignContent: this.grouping.alignGroupContent
        });
        for (let col of this.grouping.dataGroupColumns) {
            visibleColumns.push({
                columnId: '__' + col.columnId + '__',
                getLabel: col.getLabel,
                width: col.width,
                alignContent: col.alignContent
            });
        }
        return visibleColumns;
    }
}
