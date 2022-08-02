import {TableColumn} from '../models/TableColumn';

export class TableColumns {

    static From(columns: TableColumn[]) {
        const _columns = columns.map(c => new TableColumn(c));
        TableColumns.fillMissingColumnsWidth(_columns);
        return _columns;
    }

    private static fillMissingColumnsWidth(columns: TableColumn[]) {
        const { totalWidthTaken, columnsWithoutWidth } = TableColumns.getWidthUsageInfo(columns);
        const availableTableWidth = 100 - totalWidthTaken;
        const autoColumnWidth = (availableTableWidth / columnsWithoutWidth) + '%';
        columns.forEach(c => {
            if (!c.width) {
                c.width = autoColumnWidth;
            }
        });
    }

    private static getWidthUsageInfo(columns: TableColumn[]) {
        let columnsWithoutWidth = 0;
        const totalWidthTaken = columns.reduce((acc, c) => {
            if (!c.width) columnsWithoutWidth++;
            return acc + (c.width ? parseFloat(c.width.slice(0, -1)) : 0); // remove % and convert to number
        }, 0);
        return { totalWidthTaken, columnsWithoutWidth };
    }
}
