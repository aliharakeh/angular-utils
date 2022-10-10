export interface ETColumn<T> {
	/** id of the column */
	id: string;
	/** header label of the column */
	label?: string;
	/** whether the column template is provided through &lt;ng-content&gt; */
	custom?: boolean;
	/** a function to mutate the used column value */
	getValue?: (data: T) => string;
	/** a function to use when sorting the column values */
	sortBy?: (a: ETRowData<T>, b: ETRowData<T>) => number;
	/** whether the column should be sorted by default (applies to the first sorted column only) */
	sort?: boolean;
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

/** the type of the table row data */
export type ETRowData<T> = T & {
	GROUP_KEY: string;
	STATUS_COLOR: string;
	readonly RAW_DATA: T;
	readonly DATA_HASH: string;
};

/** the type of the table group row data */
export interface GroupRowData<T> {
	groupName: string;
	data: Partial<T>;
	groupData: ETRowData<T>[];
	isReduced: boolean;
	isGroup: boolean;
}

/** the type of the displayed table column data */
export interface DisplayedGroupColumns {
	columnId: string;
	getLabel: any;
	width: string;
	alignContent: string;
}

export interface ETSort<T> {
	/** The id of the column being sorted */
	active: string;
	/** The sort direction */
	direction: number;
	/** The sort function */
	sortBy: (a: ETRowData<T>, b: ETRowData<T>) => number;
}

export interface GroupedData<T> {
	[key: string]: [groupItem: GroupRowData<T>, ...indexes: ETRowData<T>[]];
}

export type FlattenedGroupedData<T> = GroupRowData<T> & ETRowData<T>;

export interface EtConfig<T> {
	setData(data: T[]): void;

	setColumns(columns: ETColumn<T>[]): void;

	setGroupByColumns(groupByColumns: ETGroupByColumns<T>): void;

	setGroupingConfig(groupingOptions: ETGroupingConfig<T>): void;

	setDataGroupColumns(dataGroupColumns: ETDataGroupColumns<T>): void;

	setHiddenColumns(hiddenColumns: string[]): void;

	setWithSelection(withSelection: boolean): void;

	setLinesPerRow(linesPerRow: number): void;

	setDefaultSelection(selection: ETRowData<T>[]): void;
}
