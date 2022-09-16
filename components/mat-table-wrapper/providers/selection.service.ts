import {Injectable} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableWrapperRowData} from '../models/mat-table-wrapper-row-data';

@Injectable()
export class SelectionService<T> {

    selection = new SelectionModel<MatTableWrapperRowData<T>>(true, []);

    constructor() { }

    get selected() {
        return this.selection.selected;
    }

    get onChange() {
        return this.selection.changed;
    }

    toggleAll(data) {
        if (this.areAllSelected(data)) {
            this.clear();
        }
        else {
            this.selection.clear();
            data?.forEach(row => this.selection.select(row));
        }
    }

    toggle(value) {
        this.selection.toggle(value);
    }

    clear() {
        this.selection.clear();
    }

    areAllSelected(data) {
        const numSelected = this.selection.selected.length;
        const numNonGroupRows = data?.length;
        return data?.length && numSelected === numNonGroupRows;
    }
}
