import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatTableWrapperRowData} from '../models/mat-table-wrapper-row-data';
import {Sort} from '@angular/material/sort';
import {CdkTable} from '@angular/cdk/table';
import {SelectionService} from '../providers/selection.service';
import {takeWhile, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatTableWrapperColumnDirective} from '../directives/mat-table-wrapper-column.directive';
import {MatTableWrapperColumn} from '../models/mat-table-wrapper-column';
import {MatTableWrapperBase} from './mat-table-wrapper-base';
import {MatTableWrapperConfigService} from '../providers/mat-table-wrapper-config.service';
import {MatTableWrapperGroupByColumn} from '../models/mat-table-wrapper-group-by-column';
import {
    MatTableWrapperDataGroupColumns,
    MatTableWrapperGroupByColumns,
    MatTableWrapperGroupingConfig
} from '../models/mat-table-wrapper-grouping';
import {MatTableWrapperDataGroupColumn} from '../models/mat-table-wrapper-data-group-column';

/**
 * The Idea of this component is to have a simple & extendable wrapper over cdk-table.
 *
 * ## Features:
 * - group data
 * - non-grouped & grouped data sorting
 * - hide columns
 * - data selection
 * - row click action
 * - column customization options
 * - custom external column templates
 * - grouping header customization
 *
 *
 * ## CSS Config
 *
 * ### Table
 * --cdk-table-border: #797575;
 * --cdk-table-border-radius: 10px 10px 0 0;
 * --cdk-table-font: 500;
 *
 * ### Rows
 * --cdk-header-row-fw: 600;
 * --cdk-header-row-bg: #797575;
 * --cdk-group-row-bg: #797575;
 * --cdk-group-row-hover-bg: #797575;
 * --cdk-row-hover-bg: #797575;
 * --cdk-row-padding: 0; // 0 12px
 * --cdk-row-status-color: transparent;
 * --cdk-row-status-width: 4px;
 * --cdk-row-status-height: 60%;
 * --cdk-row-status-left: -5px;
 * --cdk-row-status-top: 20%;
 * --cdk-row-status-border: 2px 0 0 2px;
 *
 * ### Grouping
 * --cdk-table-group-spacing: 16px;
 *
 * ### Cells
 * --cdk-header-cell-padding: 10px 8px;
 * --cdk-cell-padding: 12px 8px;
 *
 * ### Utils
 * --cdk-min-cell-width: 6ch;
 * --cdk-line-clamp: 1;
 *
 * **Note**: for simplicity, this component doesn't include any complex conditional logic on columns or rows as this can
 * be done through the table configuration from outside the component.
 * */
@Component({
    selector: 'app-mat-table-wrapper',
    templateUrl: './mat-table-wrapper.component.html',
    styleUrls: ['./mat-table-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatTableWrapperComponent<T> extends MatTableWrapperBase<T>
    implements OnInit, AfterContentInit, OnChanges, OnDestroy {

    /** add selection capability to the table  */
    @Input()
    withSelection: boolean = false;

    @Input()
    tableId: string;

    /** specify the maximum allowed lines for each table row text to wrap on before the text is truncated */
    @Input('linesPerRow')
    set setLinesPerRow(linesPerRow: number) {
        this.elRef.nativeElement.style.setProperty('--cdk-line-clamp', linesPerRow);
    }

    /** specify the default selected data */
    @Input('defaultSelection')
    set defaultSelection(selection: MatTableWrapperRowData<T>[]) {
        this.selection.toggleAll(selection);
    }

    /** specify a custom function to get the table row status color */
    @Input('getStatusColor')
    set getStatusColorSetter(getStatusColor : (data: MatTableWrapperRowData<T>) => string) {
        this.getStatusColor = getStatusColor;
    };

    /** specify the table data */
    @Input('data')
    set setData(data: T[]) {
        this.setTableData(data);
    }

    /** specify the table columns display & grouping configuration */
    @Input('columns')
    set setColumns(columns: MatTableWrapperColumn<T>[]) {
        this.setTableColumns(columns);
    }

    /** specify the table columns display & grouping configuration */
    @Input('groupingColumns')
    set setGroupingColumns(groupByColumns: MatTableWrapperGroupByColumns<T>) {
        this.setTableGroupByColumns(groupByColumns);
    }

    /** specify the table columns display & grouping configuration */
    @Input('groupingConfig')
    set setGroupingConfig(groupingOptions: MatTableWrapperGroupingConfig<T>) {
        this.setTableGroupingConfig(groupingOptions);
    }

    /** specify the table columns display & grouping configuration */
    @Input('dataGroupingColumns')
    set setDataGroupingColumns(dataGroupColumns: MatTableWrapperDataGroupColumns<T>) {
        this.setTableDataGroupColumns(dataGroupColumns);
    }

    /** specify the table columns to hide */
    @Input('hiddenColumns')
    set hiddenColumnsSetter(hiddenColumns: string[]) {
        this.setHiddenColumns(hiddenColumns);
    };

    /** an action to call when a row is clicked */
    @Output()
    rowClick: EventEmitter<MatTableWrapperRowData<T>> = new EventEmitter<MatTableWrapperRowData<T>>();

    /** an action to call when rows are selected */
    @Output('selection')
    selectionChange: EventEmitter<MatTableWrapperRowData<T>[]> = new EventEmitter<MatTableWrapperRowData<T>[]>();

    // table reference
    @ViewChild(CdkTable, { static: true })
    table: CdkTable<T>;

    // custom external table columns
    @ContentChildren(MatTableWrapperColumnDirective)
    columnDefs: QueryList<MatTableWrapperColumnDirective>;

    constructor(
        private elementRef: ElementRef,
        private selectionService: SelectionService<T>,
        private configService: MatTableWrapperConfigService<T>
    ) {
        super(elementRef, selectionService);
    }

    ngOnInit() {
        // save component instance
        this.configService.addTableInstance(this.tableId, this);

        // TODO: will not work with "withSelection" input change.
        //  see if you can put it in the input set function
        this.selection.onChange.pipe(
            takeWhile(_ => this.withSelection && !this.destroyed),
            map(_ => this.selection.selected),
            tap((selected: MatTableWrapperRowData<T>[]) => this.selectionChange.emit(selected))
        ).subscribe();
    }

    ngAfterContentInit() {
        this.columnDefs.forEach(c => this.templates[c.columnId] = c.templateRef);
    }

    // needed the first time to wait for all inputs to have their values to do some shared actions
    ngOnChanges(changes: SimpleChanges) {
        if (this.firstRender) {
            this.firstRender = false;
            this.setDisplayedColumns();
            this.buildDataSource();
            this.ready = true;
        }
    }

    ngOnDestroy() {
        this.destroyed = true;
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

    rowAction(data: any) {
        this.rowClick.emit(data);
    }

    onSort(sort: Sort) {
        this.sort = sort;
        this.buildDataSource();
    }

    isSorted(columnId) {
        if (this.sort?.active !== columnId) return 0;
        return this.sort.direction === 'asc' ? 1 : this.sort.direction === 'desc' ? -1 : 0;
    }

    toggleAll() {
        this.selection.toggleAll(this.data);
        this.areAllSelected = this.selection.areAllSelected(this.data);

        // TODO: you can add here to show collapsed groups
        // if (this.areAllSelected) {
        //     this.collapsedGroups.clear();
        //     this.buildDataSource()
        // }
    }
}
