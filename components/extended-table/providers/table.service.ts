import {Injectable} from '@angular/core';
import {ETColumn} from '../models/interfaces';
import {fromColumns, updateColumnsAutoWidth} from '../utils/columns-util';
import {TableColumn} from '../models/implementations';

@Injectable()
export class TableService<T> {
    columns: TableColumn<T>[] = [];
    displayedColumns: TableColumn<T>[] = []; // displayed table columns & their order
    hiddenColumns: Set<string> = new Set(); // hidden table columns

    constructor() { }

    setColumns(columns: ETColumn<T>[]) {
        this.columns = fromColumns(columns);
        this.displayedColumns = this.columns;
    }

    setHiddenColumns(hiddenColumns: string[]) {
        this.hiddenColumns = new Set<string>(hiddenColumns);
        this.displayedColumns = this.columns.filter(c => !this.hiddenColumns.has(c.id));
    }

    updateDisplayedTableColumns() {
        this.displayedColumns = updateColumnsAutoWidth(this.displayedColumns);
    }
}
