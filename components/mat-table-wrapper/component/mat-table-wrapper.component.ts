import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input, OnChanges,
    Output,
    QueryList, SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatColumnDef, MatTable, MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {TableColumn} from '../models/column';
import {RowData} from '../models/row-data';
import {DisplayedGroupColumns, TableConfig, TableConfiguration} from '../models/table-config';

/*
* The Idea of this component is to have a simple & extendable wrapper over cdk-table.
* Features:
*   - group table data by adding a row before each group as a header to the grouped data. This header can be customized
*     through the GroupColumn class properties in the table options.
*   - single & multi select of table data.
*   - column customization through the TableColumn class properties options.
*   - custom external columns added through `ng-content` to customize any non-text column that needs to be added
*     to the table.
* Note: for simplicity, this component doesn't include any complex conditional logic on columns or rows as this can
* be done through the table configuration from outside the component.
* */
@Component({
    selector: 'app-mat-table-wrapper',
    templateUrl: './mat-table-wrapper.component.html',
    styleUrls: ['./mat-table-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTableWrapperComponent<T = any> implements AfterContentInit, OnChanges {

    @Input() withSelection: boolean = false;

    @Input('linesPerRow') set setLinesPerRow(linesPerRow: number) {
        this.elRef.nativeElement.style.setProperty('--cdk-line-clamp', linesPerRow);
    }

    @Input('defaultSelection') set defaultSelection(selection: any[]) {
        this.selection.clear();
        selection.forEach(s => this.selection.select(s));
    }

    @Input() getStatusColor: (data) => string = (_) => 'transparent';

    @Input('data') set setData(data: any[]) {
        this.data = data || [];
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    @Input('tableConfig') set setTableConfig(tableConfig: TableConfig) {
        this.tableConfiguration = new TableConfiguration(tableConfig);
        this.tableConfiguration.columns.forEach(col => {
            this.displayedColumns.push(col.id);
            if (!col.custom) this.textColumns.push(col);
        });
        this.displayedGroupColumns = this.tableConfiguration.getDisplayedGroupColumns();
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    @Output() rowClick: EventEmitter<RowData<T>> = new EventEmitter<RowData<T>>();
    @Output('selection') selectionChange: EventEmitter<RowData<T>[]> = new EventEmitter<RowData<T>[]>();

    @ViewChild(MatTable, { static: true }) table: MatTable<T>; // table
    @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>; // custom external table columns

    firstRender = true;
    data = []; // source data
    dataSource = new MatTableDataSource([]); // displayed table data
    tableConfiguration: TableConfiguration = new TableConfiguration(null); // table options
    textColumns: TableColumn[] = []; // columns that only include text (non-custom columns)
    displayedColumns: string[] = []; // displayed table columns & their order
    displayedGroupColumns: DisplayedGroupColumns[] = []; // displayed table grouping columns & their order
    collapsedGroups = new Set<string>(); // groups that are collapsed
    selection = new SelectionModel<any>(true, []); // selected data

    constructor(private elRef: ElementRef) {}

    ngAfterContentInit() {
        this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef)); // add external columns
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.firstRender) {
            this.firstRender = false;
            this.buildDataSource();
        }
    }

    buildDataSource() {
        console.log('buildDataSource');
        this.dataSource.data = this.data.length > 0 ? this.groupedData() : [];
        this.elRef.nativeElement.style.setProperty('--cdk-num-of-cols', this.displayedColumns.length);
    }

    groupedData() {
        if (!this.tableConfiguration.isDataGrouped) return this.data;
        // construct the groups
        let groups = this.data?.reduce((groups, row) => this.customReducer(groups, row), {});
        // get grouped table rows
        let groupArray: any[] = groups ? Object.values(groups) : [];
        // flatten the data to create one single level array containing the group & data rows
        let flatList = groupArray?.reduce((a, c) => a.concat(c), []);
        // we filter the final data by keeping the both the grouping & non-collapsed rows
        return flatList?.filter(row => row.isGroup || !this.collapsedGroups.has(row.__groupName__));
    }

    customReducer(groups, row) {
        const groupName = this.tableConfiguration.getDefaultGroupKey(row);
        // add a grouping row as a header for each group of data
        if (!groups[groupName]) {
            groups[groupName] = this.initGroup(groupName, row);
        }
        const rowData: RowData<T> = {
            ...this.getMutatedData(row),
            __rawData__: row,
            __groupName__: groupName,
            __statusColor__: this.getStatusColor(row)
        };
        // add the data to the group
        groups[groupName].push(rowData);
        // leave a pointer to all group row data inside the group row
        groups[groupName][0].groupData.push(rowData);
        return groups;
    };

    initGroup(groupName, row) {
        return [{
            groupName,
            data: this.tableConfiguration.getGroupByData(row),
            groupData: [],
            isReduced: this.collapsedGroups.has(groupName),
            isGroup: true
        }];
    }

    getMutatedData(rowData) {
        const mutatedData = { ...rowData };
        this.textColumns.forEach(c => {
            if (c.getValue) {
                mutatedData[c.id] = c.getValue(rowData);
            }
        });
        return mutatedData;
    }

    get visibleGroupColumnsIds() {
        return this.displayedGroupColumns.map(gc => gc.columnId);
    }

    isGroup(index, item): boolean {
        return item.isGroup;
    }

    toggleGroup(group) {
        this.collapsedGroups.has(group.groupName) ?
            this.collapsedGroups.delete(group.groupName) :
            this.collapsedGroups.add(group.groupName);
        this.buildDataSource();
    }

    toggleAllRowsSelection() {
        if (this.isAllSelected()) {
            this.selection.clear();
        }
        else {
            this.selection.clear();
            this.data?.forEach(row => this.selection.select(row));
            this.collapsedGroups.clear();
            this.buildDataSource();
        }
        this.emitSelection();
    }

    toggleRowSelection(value) {
        this.selection.toggle(value);
        this.emitSelection();
    }

    emitSelection() {
        if (this.withSelection) {
            this.selectionChange.emit(this.selection.selected);
        }
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numNonGroupRows = this.data?.length;
        return numSelected === numNonGroupRows;
    }

    rowAction(data: any) {
        this.rowClick.emit(data);
    }
}
