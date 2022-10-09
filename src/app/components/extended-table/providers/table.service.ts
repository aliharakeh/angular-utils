import {Injectable} from '@angular/core';
import {ETColumn} from '../models/interfaces';
import {TableColumn} from '../models/implementations';

@Injectable()
export class TableService<T> {
	columns: TableColumn<T>[] = [];
	displayedColumns: TableColumn<T>[] = []; // displayed table columns & their order
	hiddenColumns: Set<string> = new Set(); // hidden table columns

	constructor() { }

	setColumns(columns: ETColumn<T>[]) {
		this.columns = this.fromColumns(columns);
		this.displayedColumns = this.columns;
	}

	setHiddenColumns(hiddenColumns: string[]) {
		this.hiddenColumns = new Set<string>(hiddenColumns);
		this.displayedColumns = this.columns.filter(c => !this.hiddenColumns.has(c.id));
	}

	updateDisplayedTableColumns() {
		this.displayedColumns = this.updateColumnsAutoWidth(this.displayedColumns);
	}

	private fromColumns(columns: ETColumn<any>[]) {
		return this.updateColumnsAutoWidth(columns.map(c => new TableColumn(c)));
	}

	private updateColumnsAutoWidth(columns: TableColumn<any>[]) {
		const updatedColumns = [...columns];
		const { totalWidthTaken, columnsWithoutWidth } = this.getWidthUsageInfo(updatedColumns);
		const availableTableWidth = 100 - totalWidthTaken;
		const autoColumnWidth = (availableTableWidth / columnsWithoutWidth) + '%';
		updatedColumns.forEach(c => {
			if (!c.width) {
				c.autoWidth = autoColumnWidth;
			}
		});
		return updatedColumns;
	}

	private getWidthUsageInfo(columns: TableColumn<any>[]) {
		let columnsWithoutWidth = 0;
		const totalWidthTaken = columns.reduce((acc, c) => {
			if (!c.width) columnsWithoutWidth++;
			return acc + (c.width ? parseFloat(c.width.slice(0, -1)) : 0); // remove % and convert to number
		}, 0);
		return { totalWidthTaken, columnsWithoutWidth };
	}
}
