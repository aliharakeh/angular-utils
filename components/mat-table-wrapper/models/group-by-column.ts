export interface GroupByColumn {
    columnId: string;
    getGroupingKey?: (data) => string;
}

export class TableGroupByColumn implements GroupByColumn {
    columnId: string = '';
    getGroupingKey: (data) => string = (data) => data[this.columnId];

    constructor(options: GroupByColumn) {
        Object.assign(this, options);
    }
}
