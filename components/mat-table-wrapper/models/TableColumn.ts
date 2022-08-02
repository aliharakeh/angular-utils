export class TableColumn {
    columnDef: string;
    label?: string = '';
    textColumn?: boolean = true;
    getValue?: (row) => string = (row) => row[this.columnDef];
    headerStyles?: string;
    cellStyles?: string;
    position?: 'left' | 'center' | 'right' = 'left';
    width?: string;

    constructor(options: TableColumn) {
        Object.assign(this, options);
    }
}
