import {MatTableWrapperRowData} from './mat-table-wrapper-row-data';

export interface MatTableWrapperDataGroupColumn<T> {
    /** id of the column */
    columnId: string;
    /** a function to get the label of the column in the group header */
    getLabel: (groupData: MatTableWrapperRowData<T>[]) => string;
    /** the number of columns the label spans to */
    colspan?: number;
    /** text alignment of the group header column */
    alignContent?: 'left' | 'center' | 'right';
}

/** A class that will initialize some data grouping column values if they are not provided */
export class TableDataGroupColumn<T> implements MatTableWrapperDataGroupColumn<T> {
    columnId: string = '';
    getLabel: (groupData: MatTableWrapperRowData<T>[]) => string;
    colspan: number = 1;
    alignContent: 'left' | 'center' | 'right' = 'left';
    width = null;

    constructor(options: MatTableWrapperDataGroupColumn<T>) {
        Object.assign(this, options);
    }
}
