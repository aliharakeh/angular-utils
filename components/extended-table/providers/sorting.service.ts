import {Injectable} from '@angular/core';
import {ETSort} from '../models/interfaces';

@Injectable()
export class SortingService<T> {

    sort: ETSort = null;

    constructor() { }

    getSortedData(dataToSort) {
        const data = [...dataToSort];
        if (this.sort && this.sort.direction) {
            return this.sortData(data);
        }
        return data;
    }

    sortData(data) {
        const { active, direction } = this.sort || {};
        if (!active || !direction) return data;
        return data.sort((a, b) => a[active].localeCompare(b[active]) * direction);
    }
}
