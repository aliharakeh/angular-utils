import {Injectable} from '@angular/core';
import {ETRowData, FlattenedGroupedData, GroupedData, GroupRowData} from '../models/interfaces';
import {GroupingService} from './grouping.service';
import {TableService} from './table.service';
import {SortingService} from './sorting.service';

@Injectable()
export class DataService<T> {

	data: ETRowData<T>[] = []; // source data
	collapsedGroups = new Set<string>(); // groups that are collapsed
	getStatusColor: ((data: ETRowData<T>) => string) = _ => 'transparent';

	constructor(
		private groupingService: GroupingService<T>,
		private tableService: TableService<T>,
		private sortingService: SortingService<T>
	) { }

	setData(data: T[]) {
		this.data = (data || []).map(rowData => this.getRowData(rowData));
	}

	getRowData(rowData: T): ETRowData<T> {
		return {
			...this.getMutatedData(rowData),
			RAW_DATA: rowData,
			DATA_HASH: this.createObjHash(rowData),
			GROUP_KEY: '',
			STATUS_COLOR: ''
		};
	}

	getMutatedData(rowData: T) {
		const mutatedData: any = { ...rowData };
		this.tableService.columns.forEach(c => {
			if (c.getValue) {
				mutatedData[c.id] = c.getValue(rowData);
			}
		});
		return mutatedData;
	}

	createObjHash(obj: any): string {
		let hash = 0;
		const val = JSON.stringify(obj);
		if (val.length === 0) return hash + '';
		for (let i = 0; i < val.length; i++) {
			hash = ((hash << 5) - hash) + val.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}
		return hash + '';
	}

	getData(): FlattenedGroupedData<T>[] {
		if (!this.groupingService.isDataGrouped) {
			return this.sortingService.getSortedData(this.data) as FlattenedGroupedData<T>[];
		}
		// construct the groups
		let groups: GroupedData<T> = this.data?.reduce((groups, row) => this.customReducer(groups, row), {});
		// sort group data
		for (const key in groups) {
			groups[key] = [
				groups[key].shift() as GroupRowData<T>,
				...this.sortingService.sortData(groups[key] as ETRowData<T>[])
			];
		}
		// get grouped table rows
		let groupArray: any[] = groups ? Object.values(groups) : [];
		// flatten the data to create one single level array containing the group & data rows
		let flatList = groupArray?.reduce((a, c) => a.concat(c), []);
		// we filter the final data by keeping the both the grouping & non-collapsed rows
		return flatList?.filter((row: FlattenedGroupedData<T>) => row.isGroup || !this.collapsedGroups.has(row.GROUP_KEY));
	}

	customReducer(groups: GroupedData<T>, row: ETRowData<T>) {
		const groupName = this.groupingService.getDefaultGroupKey(row);
		row.GROUP_KEY = groupName;
		row.STATUS_COLOR = this.getStatusColor(row);
		// add a grouping row as a header for each group of data
		if (!groups[groupName]) {
			groups[groupName] = [this.createGroupRow(groupName, row)];
		}
		// add the data to the group
		groups[groupName].push(row);
		// leave a pointer to all group row data inside the group row
		groups[groupName][0].groupData.push(row);
		return groups;
	}

	createGroupRow(groupName: string, row: ETRowData<T>): GroupRowData<T> {
		return {
			groupName,
			data: this.groupingService.getGroupByData(row),
			groupData: [],
			isReduced: this.collapsedGroups.has(groupName),
			isGroup: true
		};
	}

}
