import {MatTableWrapperColumn, TableColumn} from './mat-table-wrapper-column';
import {MatTableWrapperGroupByColumn, TableGroupByColumn} from './mat-table-wrapper-group-by-column';
import {MatTableWrapperDataGroupColumn, TableDataGroupColumn} from './mat-table-wrapper-data-group-column';
import {MatTableWrapperRowData} from './mat-table-wrapper-row-data';
import {mergeColumnsWidths} from '../utils/columns-util';

export type MatTableWrapperGroupByColumns<T> = (string | MatTableWrapperGroupByColumn<T>)[];

export type MatTableWrapperDataGroupColumns<T> = MatTableWrapperDataGroupColumn<T>[];

export interface MatTableWrapperGroupingConfig<T> {
    /** a function to get the grouping label of the group-by columns */
    getGroupLabel?: (groupData: MatTableWrapperRowData<T>[]) => string;
    /** the number of columns the group label spans to */
    groupColspan?: number;
    /** text alignment of the group column */
    alignGroupContent?: 'left' | 'center' | 'right';
}

/** A class that will initialize some table grouping values if they are not provided */
export class TableGrouping<T> {
    groupByColumns: TableGroupByColumn<T>[] = [];
    dataGroupColumns: TableDataGroupColumn<T>[] = [];
    getGroupLabel: (groupData: MatTableWrapperRowData<T>[]) => string = (groupData) => this.getDefaultGroupKey(groupData[0]);
    groupColspan: number = 1;
    alignGroupContent: 'left' | 'center' | 'right' = 'left';
    groupWidth;
    _columns: TableColumn<T>[];

    constructor(columns: TableColumn<T>[]) {
        this._columns = columns;
    }

    setGroupingConfig(groupingOptions: MatTableWrapperGroupingConfig<T>) {
        const { groupColspan, ...options } = groupingOptions;
        if (groupColspan) this.groupColspan = groupColspan;
        Object.assign(this, options);
        this.groupWidth = mergeColumnsWidths(this._columns, 0, this.groupColspan);
    }

    setDataGroupColumns(dataGroupColumns: MatTableWrapperDataGroupColumns<T>) {
        let startIndex = this.groupColspan;
        dataGroupColumns.forEach(column => {
            const dataGroupColumn = new TableDataGroupColumn(column);
            dataGroupColumn.width = mergeColumnsWidths(this._columns, startIndex, dataGroupColumn.colspan);
            this.dataGroupColumns.push(dataGroupColumn);
            startIndex = startIndex + dataGroupColumn.colspan;
        });
    }

    setGroupByColumns(groupByColumns: MatTableWrapperGroupByColumns<T>) {
        this.groupByColumns = groupByColumns.map(column => {
            if (typeof column === 'string') {
                column = { columnId: column };
            }
            return new TableGroupByColumn(column);
        });
    }

    getDefaultGroupKey(data: MatTableWrapperRowData<T>) {
        return this.groupByColumns.reduce((acc, c, i) => {
            return acc + (i > 0 ? '_' : '') + c.getGroupingKey(data);
        }, '');
    }
}


