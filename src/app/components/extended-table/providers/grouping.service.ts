import {Injectable} from '@angular/core';
import {TableColumn, TableDataGroupColumn, TableGroupByColumn} from '../models/implementations';
import {
	DisplayedGroupColumns,
	ETDataGroupColumns,
	ETGroupByColumns,
	ETGroupingConfig,
	ETRowData
} from '../models/interfaces';
import {TableService} from './table.service';

@Injectable()
export class GroupingService<T> {

	groupByColumns: TableGroupByColumn<T>[] = [];
	dataGroupColumns: TableDataGroupColumn<T>[] = [];
	getGroupLabel: (groupData: ETRowData<T>[]) => string = (groupData) => this.getDefaultGroupKey(groupData[0]);
	groupColspan: number = 1;
	alignGroupContent: 'left' | 'center' | 'right' = 'left';
	groupWidth!: string;
	displayedGroupColumns: DisplayedGroupColumns[] = []; // displayed table grouping columns & their order

	constructor(private tableService: TableService<T>) { }

	get isDataGrouped() {
		return this.groupByColumns.length > 0;
	}

	getGroupByData(data: ETRowData<any>) {
		return this.groupByColumns.reduce((acc, c) => ({ ...acc, [c.columnId]: data[c.columnId] }), {});
	}

	setGroupByColumns(groupByColumns: ETGroupByColumns<T>) {
		this.groupByColumns = groupByColumns.map(column => {
			if (typeof column === 'string') {
				column = { columnId: column };
			}
			return new TableGroupByColumn(column);
		});
	}

	setGroupingConfig(groupingOptions: ETGroupingConfig<T>) {
		const { groupColspan, ...options } = groupingOptions;
		if (groupColspan) this.groupColspan = groupColspan;
		Object.assign(this, options);
		this.updateGroupWidth();
	}

	updateGroupWidth() {
		this.groupWidth = this.mergeColumnsWidths(this.tableService.displayedColumns, 0, this.groupColspan);
	}

	setDataGroupColumns(dataGroupColumns: ETDataGroupColumns<T>) {
		this.dataGroupColumns = dataGroupColumns.map(dataGroupColumn => new TableDataGroupColumn(dataGroupColumn));
		this.updateDataGroupColumnsWidths();
	}

	updateDataGroupColumnsWidths() {
		let startIndex = this.groupColspan;
		this.dataGroupColumns.forEach(column => {
			column.width = this.mergeColumnsWidths(this.tableService.displayedColumns, startIndex, column.colspan);
			startIndex = startIndex + column.colspan;
		});
	}

	getDefaultGroupKey(data: ETRowData<T>) {
		return this.groupByColumns.reduce((acc, c, i) => {
			return acc + (i > 0 ? '_' : '') + c.getGroupingKey(data);
		}, '');
	}

	updateDisplayedGroupColumns() {
		const displayedGroupColumns: DisplayedGroupColumns[] = [];
		displayedGroupColumns.push({
			columnId: '__groupingColumn__',
			getLabel: this.getGroupLabel,
			width: this.groupWidth,
			alignContent: this.alignGroupContent
		});
		for (let col of this.dataGroupColumns) {
			displayedGroupColumns.push({
				columnId: '__' + col.columnId + '__',
				getLabel: col.getLabel,
				width: col.width,
				alignContent: col.alignContent
			});
		}
		this.displayedGroupColumns = displayedGroupColumns;
	}

	updateGroupRow() {
		this.updateGroupWidth();
		this.updateDataGroupColumnsWidths();
		this.updateDisplayedGroupColumns();
	}

	private mergeColumnsWidths(columns: TableColumn<any>[], start: number, colspan: number) {
		const mergedWidth = columns.slice(start, start + colspan).reduce((acc, c) => {
			const width = c.width || c.autoWidth;
			return acc + parseFloat(width.slice(0, -1));
		}, 0);
		return mergedWidth + '%';
	}
}
