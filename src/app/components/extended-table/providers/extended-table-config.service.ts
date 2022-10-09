import {Injectable} from '@angular/core';
import {EtConfig} from '../models/interfaces';
import {ExtendedTableComponent} from '../component/extended-table.component';

@Injectable()
export class ETConfigService<T> {

	private instances: { [key: string]: ExtendedTableComponent<T> } = {};
	private defaultTableId = 'default';
	private lastTableId = 'default';

	constructor() {}

	addTableInstance(id: string, instance: ExtendedTableComponent<T>) {
		this.instances[id] = instance;
		this.lastTableId = id;
	}

	get defaultTable(): EtConfig<T> {
		const tableId = this.instances.hasOwnProperty(this.defaultTableId) ? this.defaultTableId : this.lastTableId;
		return this.getInstance(tableId);
	}

	getTable(tableId: string): EtConfig<T> {
		return this.getInstance(tableId);
	}

	private getInstance(tableId: string) {
		const tableInstance = this.instances[tableId];
		return new class EtConfigInstance implements EtConfig<T> {
			setData = tableInstance.setData.bind(tableInstance);
			setColumns = tableInstance.setColumns.bind(tableInstance);
			setGroupByColumns = tableInstance.setGroupByColumns.bind(tableInstance);
			setGroupingConfig = tableInstance.setGroupingConfig.bind(tableInstance);
			setDataGroupColumns = tableInstance.setDataGroupColumns.bind(tableInstance);
			setHiddenColumns = tableInstance.setHiddenColumns.bind(tableInstance);
			setDefaultSelection = tableInstance.setDefaultSelection.bind(tableInstance);
			setLinesPerRow = tableInstance.setLinesPerRow.bind(tableInstance);
			setWithSelection = tableInstance.setWithSelection.bind(tableInstance);
		};
	}

}
