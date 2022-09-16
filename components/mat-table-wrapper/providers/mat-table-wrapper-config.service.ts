import {Injectable} from '@angular/core';
import {MatTableWrapperComponent} from '../component/mat-table-wrapper.component';

@Injectable()
export class MatTableWrapperConfigService<T> {

    private instances: {
        [key: string]: Pick<MatTableWrapperComponent<T>,
            'setTableData' |
            'setHiddenColumns' |
            'setTableGroupByColumns' |
            'setTableDataGroupColumns' |
            'setTableGroupingConfig'>
    } = {};
    private latestTableId = '';

    constructor() {}

    addTableInstance(id: string, instance: MatTableWrapperComponent<T>) {
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
