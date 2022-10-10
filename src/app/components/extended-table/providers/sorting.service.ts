import {Injectable} from '@angular/core';
import {ETRowData, ETSort} from '../models/interfaces';
import {TableService} from './table.service';

@Injectable()
export class SortingService<T> {

	sort: ETSort<T> | null = null;

	constructor(private tableService: TableService<T>) { }

	sortTable() {
		const firstSortedColumn = this.tableService.columns.find(c => c.sort);
		if (firstSortedColumn) {
			this.sort = {
				active: firstSortedColumn.id,
				direction: 1,
				sortBy: firstSortedColumn.sortBy
			};
		}
	}

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
		const sortBy = !!this.sort?.sortBy ? this.sort.sortBy : this.defaultSort(active);
		return data.sort((a, b) => sortBy(a, b) * direction);
	}

	private defaultSort(active: string) {
		return (a: any, b: any) => JSON.stringify(a[active]).localeCompare(JSON.stringify(b[active]));
	}
}
