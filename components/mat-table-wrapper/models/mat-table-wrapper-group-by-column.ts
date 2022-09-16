import {MatTableWrapperRowData} from './mat-table-wrapper-row-data';

export interface MatTableWrapperGroupByColumn<T> {
    /** id of the column */
    columnId: string;
    /** a function to get the key used in the grouping of the table data */
    getGroupingKey?: (data: MatTableWrapperRowData<T>) => string;
}

/** A class that will initialize some group-by column values if they are not provided */
export class TableGroupByColumn<T> implements MatTableWrapperGroupByColumn<T> {
    columnId: string = '';
    getGroupingKey: (data: MatTableWrapperRowData<T>) => string = (data: MatTableWrapperRowData<T>) => data[this.columnId];

    constructor(options: MatTableWrapperGroupByColumn<T>) {
        Object.assign(this, options);
    }
}
