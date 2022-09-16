import {MatTableDataSource} from '@angular/material/table';
import {DisplayedGroupColumns, TableDataConfig} from '../models/data-config';
import {Sort} from '@angular/material/sort';
import {MatTableWrapperRowData} from '../models/mat-table-wrapper-row-data';
import {ElementRef} from '@angular/core';
import {SelectionService} from '../providers/selection.service';
import {
    MatTableWrapperDataGroupColumns,
    MatTableWrapperGroupByColumns,
    MatTableWrapperGroupingConfig
} from '../models/mat-table-wrapper-grouping';
import {MatTableWrapperColumn} from '../models/mat-table-wrapper-column';
import {updateColumnsAutoWidth} from '../utils/columns-util';
import {MatTableWrapperDataGroupColumn} from '../models/mat-table-wrapper-data-group-column';

export class MatTableWrapperBase<T> {
    protected firstRender = true;
    protected data = []; // source data
    protected dataSource = new MatTableDataSource([]); // displayed table data
    protected tableConfiguration: TableDataConfig<T> = new TableDataConfig(); // table options
    protected displayedColumns: string[] = []; // displayed table columns & their order
    protected hiddenColumns: Set<string> = new Set(); // hidden table columns
    protected displayedGroupColumns: DisplayedGroupColumns[] = []; // displayed table grouping columns & their order
    protected collapsedGroups = new Set<string>(); // groups that are collapsed
    protected sort: Sort = null;
    protected destroyed = false;
    protected areAllSelected = false;
    protected templates = {};
    protected ready = false;

    protected getStatusColor: (data) => string;

    constructor(
        protected elRef: ElementRef,
        protected selection: SelectionService<T>
    ) {}

    public setTableData(data: T[]) {
        this.data = data || [];
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    public setTableColumns(columns: MatTableWrapperColumn<T>[]) {
        this.tableConfiguration.setColumns(columns);
        if (!this.firstRender) {
            this.setDisplayedColumns();
            this.buildDataSource();
        }
    }

    public setTableGroupByColumns(groupByColumns: MatTableWrapperGroupByColumns<T>) {
        this.tableConfiguration.setTableGroupByColumns(groupByColumns);
        this.displayedGroupColumns = this.tableConfiguration.getDisplayedGroupColumns();
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    public setTableGroupingConfig(groupingOptions: MatTableWrapperGroupingConfig<T>) {
        this.tableConfiguration.setTableGroupingConfig(groupingOptions);
        this.displayedGroupColumns = this.tableConfiguration.getDisplayedGroupColumns();
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    public setTableDataGroupColumns(dataGroupColumns: MatTableWrapperDataGroupColumns<T>) {
        this.tableConfiguration.setTableDataGroupColumns(dataGroupColumns);
        this.displayedGroupColumns = this.tableConfiguration.getDisplayedGroupColumns();
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    public setHiddenColumns(hiddenColumns: string[]) {
        this.hiddenColumns = new Set<string>(hiddenColumns);
        if (!this.firstRender) {
            this.refreshTableColumns();
        }
    }

    private refreshTableColumns() {
        const displayedColumns = this.tableConfiguration.columns.filter(c => !this.hiddenColumns.has(c.id));
        updateColumnsAutoWidth(displayedColumns);
        this.setDisplayedColumns();
        this.buildDataSource();
    }

    protected setDisplayedColumns() {
        this.displayedColumns = this.tableConfiguration.columns.reduce(
            (acc, c) => this.hiddenColumns.has(c.id) ? acc : [...acc, c.id], []
        );
    }

    protected buildDataSource() {
        this.dataSource.data = this.data.length > 0 ? this.getData() : [];
        this.elRef.nativeElement.style.setProperty('--cdk-num-of-cols', this.displayedColumns.length);
    }

    private getData() {
        if (!this.tableConfiguration.isDataGrouped) return this.sortedData();
        // construct the groups
        let groups = this.data?.reduce((groups, row) => this.customReducer(groups, row), {});
        // sort group data
        for (const key in groups) {
            const groupItem = groups[key].shift();
            groups[key] = [groupItem, ...this.sortData(groups[key])];
        }
        // get grouped table rows
        let groupArray: any[] = groups ? Object.values(groups) : [];
        // flatten the data to create one single level array containing the group & data rows
        let flatList = groupArray?.reduce((a, c) => a.concat(c), []);
        // we filter the final data by keeping the both the grouping & non-collapsed rows
        return flatList?.filter(row => row.isGroup || !this.collapsedGroups.has(row.__groupName__));
    }

    private sortedData() {
        const data = this.data.map(rowData => this.getRowData(rowData));
        if (this.sort && this.sort.direction) {
            return this.sortData(data);
        }
        return data;
    }

    private getRowData(rowData, groupName: string = ''): MatTableWrapperRowData<T> {
        return {
            ...this.getMutatedData(rowData),
            RAW_DATA: rowData,
            GROUP_KEY: groupName,
            STATUS_COLOR: this.getStatusColor(rowData)
        };
    }

    private sortData(data) {
        const { active, direction } = this.sort || {};
        if (!active || !direction) return data;
        return data.sort((a, b) => a[active].localeCompare(b[active]) * (direction === 'asc' ? 1 : -1));
    }

    private customReducer(groups, row) {
        const groupName = this.tableConfiguration.getDefaultGroupKey(row);
        // add a grouping row as a header for each group of data
        if (!groups[groupName]) {
            groups[groupName] = this.initGroup(groupName, row);
        }
        const rowData: MatTableWrapperRowData<T> = this.getRowData(row, groupName);
        // add the data to the group
        groups[groupName].push(rowData);
        // leave a pointer to all group row data inside the group row
        groups[groupName][0].groupData.push(rowData);
        return groups;
    };

    private initGroup(groupName, row) {
        return [{
            groupName,
            data: this.tableConfiguration.getGroupByData(row),
            groupData: [],
            isReduced: this.collapsedGroups.has(groupName),
            isGroup: true
        }];
    }

    private getMutatedData(rowData) {
        const mutatedData = { ...rowData };
        this.tableConfiguration.columns.forEach(c => {
            if (c.getValue) {
                mutatedData[c.id] = c.getValue(rowData);
            }
        });
        return mutatedData;
    }
}
