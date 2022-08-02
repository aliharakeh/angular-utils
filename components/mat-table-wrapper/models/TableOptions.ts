import {TableColumn} from './TableColumn';
import {TableGroupColumn} from './TableGroupColumn';
import {TableColumns} from '../classes/TableColumns';
import {TableGroupColumns} from '../classes/TableGroupColumns';

export class TableOptions {
    columns: TableColumn[] = [];
    groupColumns: TableGroupColumn[] = [];
    getStatusColor?: (data) => string = (_) => 'transparent';
    groupSpacing?: string = '16px';

    constructor(options: TableOptions) {
        options.columns = TableColumns.From(options.columns);
        options.groupColumns = TableGroupColumns.From(options.groupColumns, options.columns);
        Object.assign(this, options);
    }

    static get EMPTY() {
        return new TableOptions({ columns: [], groupColumns: [] });
    }
}
