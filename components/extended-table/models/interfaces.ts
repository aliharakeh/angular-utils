export interface ETColumn<T> {
    /** id of the column */
    id: string;
    /** header label of the column */
    label?: string;
    /** whether the column template is provided through &lt;ng-content&gt; */
    custom?: boolean;
    /** a function to mutate the used column value */
    getValue?: (data: ETRowData<T>) => string;
    /** styles for the columns header */
    headerStyles?: string;
    /** styles for the column cell */
    cellStyles?: string;
    /** text alignment of the column */
    alignContent?: 'left' | 'center' | 'right';
    /** space taken by the column */
    width?: string;
}

export interface ETDataGroupColumn<T> {
    /** id of the column */
    columnId: string;
    /** a function to get the label of the column in the group header */
    getLabel: (groupData: ETRowData<T>[]) => string;
    /** the number of columns the label spans to */
    colspan?: number;
    /** text alignment of the group header column */
    alignContent?: 'left' | 'center' | 'right';
}

export interface ETGroupByColumn<T> {
    /** id of the column */
    columnId: string;
    /** a function to get the key used in the grouping of the table data */
    getGroupingKey?: (data: ETRowData<T>) => string;
}

export type ETGroupByColumns<T> = (string | ETGroupByColumn<T>)[];

export type ETDataGroupColumns<T> = ETDataGroupColumn<T>[];

export interface ETGroupingConfig<T> {
    /** a function to get the grouping label of the group-by columns */
    getGroupLabel?: (groupData: ETRowData<T>[]) => string;
    /** the number of columns the group label spans to */
    groupColspan?: number;
    /** text alignment of the group column */
    alignGroupContent?: 'left' | 'center' | 'right';
}

/** the type of the table data */
export type ETRowData<T> = T & {
    readonly RAW_DATA: T;
    readonly DATA_HASH: string;
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

export interface ETSort {
    /** The id of the column being sorted. */
    active: string;
    /** The sort direction. */
    direction: number;
}

export interface EtConfig<T> {
    setData(data: T[]);

    setColumns(columns: ETColumn<T>[]);

    setGroupByColumns(groupByColumns: ETGroupByColumns<T>);

    setGroupingConfig(groupingOptions: ETGroupingConfig<T>);

    setDataGroupColumns(dataGroupColumns: ETDataGroupColumns<T>);

    setHiddenColumns(hiddenColumns: string[]);

    setWithSelection(withSelection: boolean);

    setLinesPerRow(linesPerRow: number);

    setDefaultSelection(selection: ETRowData<T>[]);
}
