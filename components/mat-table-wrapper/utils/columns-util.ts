import {Column, TableColumn} from '../models/column';

export class ColumnsUtil {

    public static From(columns: Column[]) {
        const _columns = columns.map(c => new TableColumn(c));
        ColumnsUtil.fillMissingColumnsWidth(_columns);
        return _columns;
    }

    private static fillMissingColumnsWidth(columns: Column[]) {
        const { totalWidthTaken, columnsWithoutWidth } = ColumnsUtil.getWidthUsageInfo(columns);
        const availableTableWidth = 100 - totalWidthTaken;
        const autoColumnWidth = (availableTableWidth / columnsWithoutWidth) + '%';
        columns.forEach(c => {
            if (!c.width) {
                c.width = autoColumnWidth;
            }
        });
    }

    private static getWidthUsageInfo(columns: Column[]) {
        let columnsWithoutWidth = 0;
        const totalWidthTaken = columns.reduce((acc, c) => {
            if (!c.width) columnsWithoutWidth++;
            return acc + (c.width ? parseFloat(c.width.slice(0, -1)) : 0); // remove % and convert to number
        }, 0);
        return { totalWidthTaken, columnsWithoutWidth };
    }

    public static mergeWidths(columns: Column[], start, colspan) {
        return Math.round(
            columns.slice(start, start + colspan).reduce((acc, c) => {
                return acc + (c.width ? parseFloat(c.width.slice(0, -1)) : 0);
            }, 0)
        ) + '%';
    }
}
