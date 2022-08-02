import {TableGroupColumn} from '../models/TableGroupColumn';
import {TableColumn} from '../models/TableColumn';

export class TableGroupColumns {

    static From(groupColumns: TableGroupColumn[], columns: TableColumn[]) {
        const _groupColumns = groupColumns.map(gc => new TableGroupColumn(gc));
        TableGroupColumns.updateGroupingColumnsWidth(_groupColumns, columns);
        return _groupColumns;
    }

    private static updateGroupingColumnsWidth(groupColumns: TableGroupColumn[], columns: TableColumn[]) {
        let startColIndex = 0;
        let endColIndex = 0;
        for (let groupColumn of groupColumns) {
            endColIndex = startColIndex + groupColumn.colspan;
            groupColumn.width = TableGroupColumns.mergeWidths(columns.slice(startColIndex, endColIndex));
            startColIndex = endColIndex;
        }
    }

    private static mergeWidths(columns: TableColumn[]) {
        return Math.round(
            columns.reduce((acc, c) => {
                return acc + (c.width ? parseFloat(c.width.slice(0, -1)) : 0);
            }, 0)
        ) + '%';
    }
}
