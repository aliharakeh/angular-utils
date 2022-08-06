export interface Column {
    id: string;
    label?: string;
    custom?: boolean;
    getValue?: (row) => string;
    headerStyles?: string;
    cellStyles?: string;
    alignContent?: 'left' | 'center' | 'right';
    width?: string;
}

export class TableColumn implements Column {
    id: string;
    label: string = '';
    custom: boolean = false;
    getValue: (row) => string;
    headerStyles: string;
    cellStyles: string;
    alignContent: 'left' | 'center' | 'right' = 'left';
    width: string;

    constructor(options: Column) {
        Object.assign(this, options);
    }
}
