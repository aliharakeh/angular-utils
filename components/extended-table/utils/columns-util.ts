/** initialize a group of table columns and fill any missing column's width */
import {ETColumn} from '../models/interfaces';
import {TableColumn} from '../models/implementations';

function fromColumns(columns: ETColumn<any>[]) {
    const _columns = columns.map(c => new TableColumn(c));
    updateColumnsAutoWidth(_columns);
    return _columns;
}

/** merges the space taken by a range of columns */
function mergeColumnsWidths(columns: TableColumn<any>[], start, colspan) {
    const mergedWidth = columns.slice(start, start + colspan).reduce((acc, c) => {
        const width = c.width || c.autoWidth;
        return acc + parseFloat(width.slice(0, -1));
    }, 0);
    return `calc(${mergedWidth}% + ${colspan - 1}px)`; // add borders `1px` value too
}

/** allocates the free columns space left to the columns with missing widths */
function updateColumnsAutoWidth(columns: TableColumn<any>[]) {
    const updatedColumns = [...columns];
    const { totalWidthTaken, columnsWithoutWidth } = _getWidthUsageInfo(updatedColumns);
    const availableTableWidth = 100 - totalWidthTaken;
    const autoColumnWidth = (availableTableWidth / columnsWithoutWidth) + '%';
    updatedColumns.forEach(c => {
        if (!c.width) {
            c.autoWidth = autoColumnWidth;
        }
    });
    return updatedColumns;
}

/** provides info about the used table space */
function _getWidthUsageInfo(columns: TableColumn<any>[]) {
    let columnsWithoutWidth = 0;
    const totalWidthTaken = columns.reduce((acc, c) => {
        if (!c.width) columnsWithoutWidth++;
        return acc + (c.width ? parseFloat(c.width.slice(0, -1)) : 0); // remove % and convert to number
    }, 0);
    return { totalWidthTaken, columnsWithoutWidth };
}

export {
    fromColumns,
    updateColumnsAutoWidth,
    mergeColumnsWidths
}
