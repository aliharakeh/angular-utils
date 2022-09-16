/** the type of the table data */
export type MatTableWrapperRowData<T> = T & {
    readonly RAW_DATA: T;
    readonly GROUP_KEY: string;
    readonly STATUS_COLOR: string;
};
