import {Injectable} from '@angular/core';
import {ETRowData, ETSort} from '../models/interfaces';

@Injectable()
export class SortingService<T> {

	sort: ETSort<T> | null = null;

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
		const sortBy = !!this.sort?.sortBy ? this.sort.sortBy : this.defaultSort(active, direction);
		return data.sort(sortBy);
	}

	private defaultSort(active: string, direction: number) {
		return (a: any, b: any) => JSON.stringify(a[active]).localeCompare(JSON.stringify(b[active])) * direction;
	}
}
