import {Injectable} from '@angular/core';
import {ETRowData} from '../models/interfaces';
import {BehaviorSubject} from 'rxjs';
import {DataService} from './data.service';

@Injectable()
export class SelectionService<T> {

    selection = new Set<string>();
    selectionSubject$: BehaviorSubject<ETRowData<T>[]> = new BehaviorSubject<ETRowData<T>[]>([]);
    areAllSelected = false;

    constructor(private dataService: DataService<T>) { }

    get onChange() {
        return this.selectionSubject$.asObservable();
    }

    get selected() {
        return this.selectionSubject$.getValue();
    }

    toggleAll(data: ETRowData<T>[]) {
        if (!data) data = [];
        this.areAllSelected = this.checkSelection();
        if (this.areAllSelected) {
            this.clear();
        }
        else {
            this.selectionSubject$.next(data);
            this.selection = new Set(data.map(d => d.DATA_HASH));
        }
    }

    toggle(data: ETRowData<T>) {
        if (this.selection.has(data.DATA_HASH)) {
            this.selection.delete(data.DATA_HASH);
            this.selectionSubject$.next(this.selected.filter(d => d.DATA_HASH !== data.DATA_HASH));
        }
        else {
            this.selection.add(data.DATA_HASH);
            this.selectionSubject$.next(this.selected.concat(data));
        }
        this.areAllSelected = this.checkSelection();
    }

    hasValue() {
        return this.selection.size > 0;
    }

    isSelected(data: ETRowData<T>) {
        return this.selection.has(data.DATA_HASH);
    }

    checkSelection() {
        const numSelected = this.selected.length;
        const numNonGroupRows = this.dataService.data?.length;
        return this.dataService.data?.length && numSelected === numNonGroupRows;
    }

    clear() {
        this.selection.clear();
        this.selectionSubject$.next([]);
    }
}
