export type RowData<T> = T & {
    __rawData__: T;
    __groupName__: string;
    __statusColor__: string;
};
