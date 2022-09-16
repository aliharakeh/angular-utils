import {MatTableWrapperRowData} from './mat-table-wrapper-row-data';

export interface MatTableWrapperColumn<T> {
    /** id of the column */
    id: string;
    /** header label of the column */
    label?: string;
    /** whether the column template is provided through &lt;ng-content&gt; */
    custom?: boolean;
    /** a function to mutate the used column value */
    getValue?: (data: MatTableWrapperRowData<T>) => string;
    /** styles for the columns header */
    headerStyles?: string;
    /** styles for the column cell */
    cellStyles?: string;
    /** text alignment of the column */
    alignContent?: 'left' | 'center' | 'right';
    /** space taken by the column */
    width?: string;
}

/** A class that will initialize some column values if they are not provided */
export class TableColumn<T> implements MatTableWrapperColumn<T> {
    id: string;
    label: string = '';
    custom: boolean = false;
    getValue: (data: MatTableWrapperRowData<T>) => string;
    headerStyles: string;
    cellStyles: string;
    alignContent: 'left' | 'center' | 'right' = 'left';
    width: string;
    autoWidth: string;

    constructor(options: MatTableWrapperColumn<T>) {
        Object.assign(this, options);
    }
}
