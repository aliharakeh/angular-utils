export class TableGroupColumn {
    name: string = '';
    valueFn?: (data) => string = (data) => data[this.name];
    labelFn?: (data, groupData) => string = (data, _) => data[this.name];
    groupBy?: boolean = true;
    colspan?: number = 1;
    width?: string;
    position?: 'left' | 'center' | 'right' = 'left';

    constructor(options: TableGroupColumn) {
        Object.assign(this, options);
    }
}
