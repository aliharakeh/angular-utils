import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChild
} from '@angular/core';
import {MatColumnDef, MatTable, MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {TableOptions} from '../models/TableOptions';
import {TableColumn} from '../models/TableColumn';
import {TableGroupColumn} from '../models/TableGroupColumn';


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
export class MatTableWrapperComponent<T> implements AfterContentInit {

    @Input() withSelection: boolean = false;

    @Input('linesPerRow') set setLinesPerRow(linesPerRow: number) {
        this.elRef.nativeElement.style.setProperty('--cdk-line-clamp', linesPerRow);
    }

    @Input('defaultSelection') set defaultSelection(selection: any[]) {
        this.selection.clear();
        selection.forEach(s => this.selection.select(s));
    }

    @Input('data') set setData(data: any[]) {
        if (data) {
            this.data = data;
            this.buildDataSource();
        }
    }

    @Input('tableOptions') set setTableOptions(tableOptions: TableOptions) {
        this.tableOptions = new TableOptions(tableOptions);
        for (const col of tableOptions.columns) {
            this.displayedColumns.push(col.columnDef);
            if (col.textColumn) this.textColumns.push(col);
        }
        this.groupByColumns = tableOptions.groupColumns.filter(c => c.groupBy);
        this.buildDataSource();
    }

    @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
    @Output('selection') selectionChange: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(MatTable, { static: true }) table: MatTable<T>; // table
    @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>; // custom external table columns

    data = []; // source data
    dataSource = new MatTableDataSource([]); // displayed table data
    tableOptions: TableOptions = TableOptions.EMPTY; // table options
    textColumns: TableColumn[] = []; // columns that only include text (non-custom columns)
    displayedColumns: string[] = []; // displayed table columns & their order
    groupByColumns: TableGroupColumn[] = []; // columns responsible for the data grouping
    collapsedGroups = new Set<string>(); // groups that are collapsed
    selection = new SelectionModel<any>(true, []); // selected data

    constructor(private elRef: ElementRef) {}

    ngAfterContentInit() {
        this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef)); // add external columns
    }

    buildDataSource() {
        this.dataSource.data = this.groupedData();
        this.elRef.nativeElement.style.setProperty('--cdk-num-of-cols', this.displayedColumns.length);
    }

    groupedData() {
        if (this.groupByColumns.length === 0) return this.data;
        // construct the groups
        let groups = this.data?.reduce((groups, row) => this._customReducer(groups, row), {});
        // get grouped table rows
        let groupArray: any[] = groups ? Object.values(groups) : [];
        // flatten the data to create one single level array containing the group & data rows
        let flatList = groupArray?.reduce((a, c) => a.concat(c), []);
        // we filter the final data by keeping the both the grouping & non-collapsed rows
        return flatList?.filter(row => row.isGroup || !this.collapsedGroups.has(row.__groupName__));
    }

    _customReducer(groups, row) {
        const groupName = this.getGroupName(row);
        // add a grouping row as a header for each group of data
        if (!groups[groupName]) {
            groups[groupName] = [this.createGroup(groupName, row)];
        }
        const rowData = {
            ...row,
            __groupName__: groupName,
            __rowStatusColor__: this.tableOptions.getStatusColor(row)
        };
        // add the data to the group
        groups[groupName].push(rowData);
        // leave a pointer to all group row data inside the group row
        groups[groupName][0].groupData.push(rowData);
        return groups;
    };

    getGroupName(data) {
        return this.groupByColumns.reduce((acc, c, i) => acc + (i > 0 ? '_' : '') + c.valueFn(data), '');
    }

    createGroup(groupName, row) {
        return {
            groupName,
            data: this.tableOptions.groupColumns.reduce((acc, c) => {
                return {
                    ...acc,
                    [c.name]: row[c.name]
                };
            }, {}),
            groupData: [],
            isReduced: this.collapsedGroups.has(groupName),
            isGroup: true
        };
    }

    get groupColumns() {
        return this.tableOptions.groupColumns.map(c => `__${c.name}__`);
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
