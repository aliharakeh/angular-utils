export interface DataGroupColumn {
    columnId: string;
    getLabel: (groupData) => string;
    colspan?: number;
    alignContent?: 'left' | 'center' | 'right';
}

export class TableDataGroupColumn implements DataGroupColumn {
    columnId: string = '';
    getLabel: (groupData) => string;
    colspan: number = 1;
    alignContent: 'left' | 'center' | 'right' = 'left';
    width = null;

    constructor(options: DataGroupColumn) {
        Object.assign(this, options);
    }
}
