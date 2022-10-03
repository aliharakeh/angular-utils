import {
    ETColumn,
    ETDataGroupColumn,
    ETGroupByColumn,
    ETRowData
} from './interfaces';

/** A class that will initialize some column values if they are not provided */
export class TableColumn<T> implements ETColumn<T> {
    id: string;
    label: string = '';
    custom: boolean = false;
    getValue: (data: ETRowData<T>) => string;
    headerStyles: string;
    cellStyles: string;
    alignContent: 'left' | 'center' | 'right' = 'left';
    width: string;
    autoWidth: string;

    constructor(options: ETColumn<T>) {
        Object.assign(this, options);
    }
}

/** A class that will initialize some data grouping column values if they are not provided */
export class TableDataGroupColumn<T> implements ETDataGroupColumn<T> {
    columnId: string = '';
    getLabel: (groupData: ETRowData<T>[]) => string;
    colspan: number = 1;
    alignContent: 'left' | 'center' | 'right' = 'left';
    width = null;

    constructor(options: ETDataGroupColumn<T>) {
        Object.assign(this, options);
    }
}

/** A class that will initialize some group-by column values if they are not provided */
export class TableGroupByColumn<T> implements ETGroupByColumn<T> {
    columnId: string = '';
    getGroupingKey: (data: ETRowData<T>) => string = (data: ETRowData<T>) => data[this.columnId];

    constructor(options: ETGroupByColumn<T>) {
        Object.assign(this, options);
    }
}
