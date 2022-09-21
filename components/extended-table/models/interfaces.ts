export interface ExtendedTableColumn<T> {
    /** id of the column */
    id: string;
    /** header label of the column */
    label?: string;
    /** whether the column template is provided through &lt;ng-content&gt; */
    custom?: boolean;
    /** a function to mutate the used column value */
    getValue?: (data: ExtendedTableRowData<T>) => string;
    /** styles for the columns header */
    headerStyles?: string;
    /** styles for the column cell */
    cellStyles?: string;
    /** text alignment of the column */
    alignContent?: 'left' | 'center' | 'right';
    /** space taken by the column */
    width?: string;
}

export interface ExtendedTableDataGroupColumn<T> {
    /** id of the column */
    columnId: string;
    /** a function to get the label of the column in the group header */
    getLabel: (groupData: ExtendedTableRowData<T>[]) => string;
    /** the number of columns the label spans to */
    colspan?: number;
    /** text alignment of the group header column */
    alignContent?: 'left' | 'center' | 'right';
}

export interface ExtendedTableGroupByColumn<T> {
    /** id of the column */
    columnId: string;
    /** a function to get the key used in the grouping of the table data */
    getGroupingKey?: (data: ExtendedTableRowData<T>) => string;
}

export type ExtendedTableGroupByColumns<T> = (string | ExtendedTableGroupByColumn<T>)[];

export type ExtendedTableDataGroupColumns<T> = ExtendedTableDataGroupColumn<T>[];

export interface ExtendedTableGroupingConfig<T> {
    /** a function to get the grouping label of the group-by columns */
    getGroupLabel?: (groupData: ExtendedTableRowData<T>[]) => string;
    /** the number of columns the group label spans to */
    groupColspan?: number;
    /** text alignment of the group column */
    alignGroupContent?: 'left' | 'center' | 'right';
}

/** the type of the table data */
export type ExtendedTableRowData<T> = T & {
    readonly RAW_DATA: T;
    readonly GROUP_KEY: string;
    readonly STATUS_COLOR: string;
};

export interface DisplayedGroupColumns {
    /** id of the column */
    columnId: string;
    /** a function to get the label of the column header */
    getLabel: any;
    /** the space taken by the column */
    width: string;
    /** text alignment of the column */
    alignContent: string;
}
