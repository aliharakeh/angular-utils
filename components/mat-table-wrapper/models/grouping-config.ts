import {Column} from './column';
import {ColumnsUtil} from '../utils/columns-util';
import {GroupByColumn, TableGroupByColumn} from './group-by-column';
import {DataGroupColumn, TableDataGroupColumn} from './data-group-column';

export type GroupByColumns = (string | GroupByColumn)[];

export interface GroupingConfig {
    groupByColumns: GroupByColumns;
    dataGroupColumns?: DataGroupColumn[];
    getGroupLabel?: (data, groupData) => string;
    groupSpacing?: string;
    groupColspan?: number;
    alignGroupContent?: 'left' | 'center' | 'right';
}

export class TableGrouping implements GroupingConfig {
    groupByColumns: TableGroupByColumn[] = [];
    dataGroupColumns: TableDataGroupColumn[] = [];
    getGroupLabel: (groupData) => string = (groupData) => this.getDefaultGroupKey(groupData[0]);
    groupSpacing: string = '16px';
    groupColspan: number = 1;
    alignGroupContent: 'left' | 'center' | 'right' = 'left';
    groupWidth;

    constructor(groupingOptions: GroupingConfig, columns: Column[]) {
        if (groupingOptions) {
            const { groupByColumns, dataGroupColumns, groupColspan, ...options } = groupingOptions;
            this.setGroupColspanAndWidth(columns, groupColspan);
            this.setDataGroupColumns(dataGroupColumns, columns);
            this.setGroupByColumns(groupByColumns);
            Object.assign(this, options);
        }
    }

    setGroupColspanAndWidth(columns: Column[], groupColspan: number) {
        if (groupColspan) this.groupColspan = groupColspan;
        this.groupWidth = ColumnsUtil.mergeWidths(columns, 0, this.groupColspan);
    }

    setDataGroupColumns(dataGroupColumns: DataGroupColumn[], columns: Column[]) {
        let startIndex = this.groupColspan;
        dataGroupColumns.forEach(column => {
            const dataGroupColumn = new TableDataGroupColumn(column);
            dataGroupColumn.width = ColumnsUtil.mergeWidths(columns, startIndex, dataGroupColumn.colspan);
            this.dataGroupColumns.push(dataGroupColumn);
            startIndex = startIndex + dataGroupColumn.colspan;
        });
    }

    setGroupByColumns(groupByColumns: GroupByColumns) {
        this.groupByColumns = groupByColumns.map(column => {
            if (typeof column === 'string') {
                column = { columnId: column };
            }
            return new TableGroupByColumn(column);
        });
    }

    getDefaultGroupKey(data) {
        return this.groupByColumns.reduce((acc, c, i) => {
            return acc + (i > 0 ? '_' : '') + c.getGroupingKey(data);
        }, '');
    }
}


