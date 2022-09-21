import {Injectable} from '@angular/core';
import {ExtendedTableComponent} from '../component/extended-table.component';

@Injectable()
export class ExtendedTableConfigService<T> {

    private instances: {
        [key: string]: Pick<ExtendedTableComponent<T>,
            'setTableData' |
            'setHiddenColumns' |
            'setTableGroupByColumns' |
            'setTableDataGroupColumns' |
            'setTableGroupingConfig'>
    } = {};
    private latestTableId = '';

    constructor() {}

    addTableInstance(id: string, instance: ExtendedTableComponent<T>) {
        this.instances[id] = instance;
        this.latestTableId = id;
    }

    get latestTable() {
        return this.instances[this.latestTableId];
    }

    get tables() {
        return this.instances;
    }

}
