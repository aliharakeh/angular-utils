import {Injectable} from '@angular/core';
import {ETRowData, ETSort} from '../models/interfaces';

@Injectable()
export class SortingService<T> {

	sort: ETSort | null = null;

	constructor() { }

	getSortedData(dataToSort: ETRowData<T>[]) {
		const data = [...dataToSort];
		if (this.sort && this.sort.direction) {
			return this.sortData(data);
		}
		return data;
	}

	sortData(data: ETRowData<T>[]) {
		const { active, direction } = this.sort || {};
		if (!active || !direction) return data;
		// @ts-ignore
		return data.sort((a, b) => a[active].localeCompare(b[active]) * direction);
	}
}
