import {mergeColumnsWidths} from '../utils/columns-util';
import {TableColumn, TableDataGroupColumn, TableGroupByColumn} from './implementations';
import {
    ExtendedTableDataGroupColumns,
    ExtendedTableGroupByColumns,
    ExtendedTableGroupingConfig,
    ExtendedTableRowData
} from './interfaces';


/** A class that will initialize some table grouping values if they are not provided */
export class TableGrouping<T> {
    groupByColumns: TableGroupByColumn<T>[] = [];
    dataGroupColumns: TableDataGroupColumn<T>[] = [];
    getGroupLabel: (groupData: ExtendedTableRowData<T>[]) => string = (groupData) => this.getDefaultGroupKey(groupData[0]);
    groupColspan: number = 1;
    alignGroupContent: 'left' | 'center' | 'right' = 'left';
    groupWidth;
    _columns: TableColumn<T>[];

    constructor(columns: TableColumn<T>[]) {
        this._columns = columns;
    }

    setGroupingConfig(groupingOptions: ExtendedTableGroupingConfig<T>) {
        const { groupColspan, ...options } = groupingOptions;
        if (groupColspan) this.groupColspan = groupColspan;
        Object.assign(this, options);
        this.groupWidth = mergeColumnsWidths(this._columns, 0, this.groupColspan);
    }

    setDataGroupColumns(dataGroupColumns: ExtendedTableDataGroupColumns<T>) {
        let startIndex = this.groupColspan;
        dataGroupColumns.forEach(column => {
            const dataGroupColumn = new TableDataGroupColumn(column);
            dataGroupColumn.width = mergeColumnsWidths(this._columns, startIndex, dataGroupColumn.colspan);
            this.dataGroupColumns.push(dataGroupColumn);
            startIndex = startIndex + dataGroupColumn.colspan;
        });
    }

    setGroupByColumns(groupByColumns: ExtendedTableGroupByColumns<T>) {
        this.groupByColumns = groupByColumns.map(column => {
            if (typeof column === 'string') {
                column = { columnId: column };
            }
            return new TableGroupByColumn(column);
        });
    }

    getDefaultGroupKey(data: ExtendedTableRowData<T>) {
        return this.groupByColumns.reduce((acc, c, i) => {
            return acc + (i > 0 ? '_' : '') + c.getGroupingKey(data);
        }, '');
    }
}


