import {
    ExtendedTableColumn,
    ExtendedTableDataGroupColumn,
    ExtendedTableGroupByColumn,
    ExtendedTableRowData
} from './interfaces';

/** A class that will initialize some column values if they are not provided */
export class TableColumn<T> implements ExtendedTableColumn<T> {
    id: string;
    label: string = '';
    custom: boolean = false;
    getValue: (data: ExtendedTableRowData<T>) => string;
    headerStyles: string;
    cellStyles: string;
    alignContent: 'left' | 'center' | 'right' = 'left';
    width: string;
    autoWidth: string;

    constructor(options: ExtendedTableColumn<T>) {
        Object.assign(this, options);
    }
}

/** A class that will initialize some data grouping column values if they are not provided */
export class TableDataGroupColumn<T> implements ExtendedTableDataGroupColumn<T> {
    columnId: string = '';
    getLabel: (groupData: ExtendedTableRowData<T>[]) => string;
    colspan: number = 1;
    alignContent: 'left' | 'center' | 'right' = 'left';
    width = null;

    constructor(options: ExtendedTableDataGroupColumn<T>) {
        Object.assign(this, options);
    }
}

/** A class that will initialize some group-by column values if they are not provided */
export class TableGroupByColumn<T> implements ExtendedTableGroupByColumn<T> {
    columnId: string = '';
    getGroupingKey: (data: ExtendedTableRowData<T>) => string = (data: ExtendedTableRowData<T>) => data[this.columnId];

    constructor(options: ExtendedTableGroupByColumn<T>) {
        Object.assign(this, options);
    }
}
