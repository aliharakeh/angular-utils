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
    SimpleChanges
} from '@angular/core';
import {SelectionService} from '../providers/selection.service';
import {filter, takeWhile, tap} from 'rxjs';
import {ETColumnDirective} from '../directives/extended-table-column.directive';
import {ETConfigService} from '../providers/extended-table-config.service';
import {
    ETColumn,
    EtConfig,
    ETDataGroupColumns,
    ETGroupByColumns,
    ETGroupingConfig,
    ETRowData,
    ETSort
} from '../models/interfaces';
import {DataService} from '../providers/data.service';
import {GroupingService} from '../providers/grouping.service';
import {TableService} from '../providers/table.service';
import {SortingService} from '../providers/sorting.service';

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
    selector: 'app-extended-table',
    templateUrl: './extended-table.component.html',
    styleUrls: ['./extended-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DataService, SelectionService, TableService, GroupingService, SortingService]
})
export class ExtendedTableComponent<T> implements OnInit, AfterContentInit, OnChanges, OnDestroy, EtConfig<T> {

    @Input() tableId: string = 'default';

    /** add selection capability to the table  */
    @Input('withSelection')
    set _withSelection(withSelection: boolean) { this.setWithSelection(withSelection); };

    setWithSelection(withSelection: boolean) {
        this.withSelection = withSelection;
    }

    /** specify the maximum allowed lines for each table row text to wrap on before the text is truncated */
    @Input('linesPerRow')
    set linesPerRow(linesPerRow: number) { this.setLinesPerRow(linesPerRow); }

    setLinesPerRow(linesPerRow: number) {
        this.elementRef.nativeElement.style.setProperty('--line-clamp', linesPerRow);
    }

    /** specify the default selected data */
    @Input('defaultSelection')
    set defaultSelection(selection: T[]) { this.setDefaultSelection(selection); }

    setDefaultSelection(selection: T[]) {
        if (selection) {
            const data = selection.map(d => this.dataService.getRowData(d));
            this.selectionService.toggleAll(data);
        }
    }

    /** specify a custom function to get the table row status color */
    @Input('getStatusColor')
    set getStatusColor(getStatusColor: (data: ETRowData<T>) => string) {
        this.dataService.getStatusColor = getStatusColor;
        if (!this.firstRender) {
            this.buildDataSource();
        }
    };

    /** specify the table data */
    @Input('data')
    set data(data: T[]) { this.setData(data); }

    setData(data: T[]) {
        this.dataService.setData(data);
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    /** specify the table columns display & grouping configuration */
    @Input('columns')
    set columns(columns: ETColumn<T>[]) { this.setColumns(columns); }

    setColumns(columns: ETColumn<T>[]) {
        this.tableService.setColumns(columns);
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    /** specify the table columns display & grouping configuration */
    @Input('groupByColumns')
    set groupByColumns(groupByColumns: ETGroupByColumns<T>) { this.setGroupByColumns(groupByColumns); }

    setGroupByColumns(groupByColumns: ETGroupByColumns<T>) {
        this.groupingService.setGroupByColumns(groupByColumns);
        if (!this.firstRender) {
            this.buildDataSource();
        }
    }

    /** specify the table columns display & grouping configuration */
    @Input('groupingConfig')
    set groupingConfig(groupingConfig: ETGroupingConfig<T>) { this.setGroupingConfig(groupingConfig); }

    setGroupingConfig(groupingConfig: ETGroupingConfig<T>) {
        this.groupingService.setGroupingConfig(groupingConfig);
        if (!this.firstRender) {
            this.groupingService.updateDisplayedGroupColumns();
            this.buildDataSource();
        }
    }

    /** specify the table columns display & grouping configuration */
    @Input('dataGroupingColumns')
    set dataGroupingColumns(dataGroupColumns: ETDataGroupColumns<T>) { this.setDataGroupColumns(dataGroupColumns); }

    setDataGroupColumns(dataGroupColumns: ETDataGroupColumns<T>) {
        this.groupingService.setDataGroupColumns(dataGroupColumns);
        if (!this.firstRender) {
            this.groupingService.updateDisplayedGroupColumns();
            this.buildDataSource();
        }
    }

    /** specify the table columns to hide */
    @Input('hiddenColumns')
    set hiddenColumns(hiddenColumns: string[]) { this.setHiddenColumns(hiddenColumns); };

    setHiddenColumns(hiddenColumns: string[]) {
        this.tableService.setHiddenColumns(hiddenColumns);
        if (!this.firstRender) {
            this.tableService.updateDisplayedTableColumns();
            this.groupingService.updateGroupRow();
            this.buildDataSource();
        }
    }

    /** an action to call when a row is clicked */
    @Output()
    rowClick: EventEmitter<ETRowData<T>> = new EventEmitter<ETRowData<T>>();

    /** an action to call when rows are selected */
    @Output('selection')
    selectionChange: EventEmitter<ETRowData<T>[]> = new EventEmitter<ETRowData<T>[]>();

    // custom external table columns
    @ContentChildren(ETColumnDirective)
    columnDefs: QueryList<ETColumnDirective>;

    public withSelection = false;
    public templates = {};
    public ready = false;
    public displayedData = []; // displayed table data
    private destroyed = false;
    private firstRender = true;

    constructor(
        public tableService: TableService<T>,
        public groupingService: GroupingService<T>,
        public elementRef: ElementRef,
        public selectionService: SelectionService<T>,
        public dataService: DataService<T>,
        public sortingService: SortingService<T>,
        private etConfigService: ETConfigService<T>
    ) {}

    ngOnInit() {
        this.etConfigService.addTableInstance(this.tableId, this);
        this.selectionService.onChange.pipe(
            takeWhile(_ => !this.destroyed),
            filter(_ => this.withSelection),
            tap((selected: ETRowData<T>[]) => this.selectionChange.emit(selected))
        ).subscribe();
    }

    ngAfterContentInit() {
        this.columnDefs.forEach(c => this.templates[c.columnId] = c.templateRef);
    }

    // needed the first time to wait for all inputs to have their values to do some shared actions
    ngOnChanges(changes: SimpleChanges) {
        if (this.firstRender) {
            this.firstRender = false;
            this.groupingService.updateDisplayedGroupColumns();
            this.buildDataSource();
            this.ready = true;
        }
    }

    ngOnDestroy() {
        this.destroyed = true;
    }

    buildDataSource() {
        this.displayedData = this.dataService.data.length > 0 ? this.dataService.getData() : [];
        this.elementRef.nativeElement.style.setProperty('--cdk-num-of-cols', this.tableService.displayedColumns.length);
    }

    isGroup(index, item): boolean {
        return item.isGroup;
    }

    toggleGroup(group) {
        this.dataService.collapsedGroups.has(group.groupName) ?
            this.dataService.collapsedGroups.delete(group.groupName) :
            this.dataService.collapsedGroups.add(group.groupName);
        this.buildDataSource();
    }

    rowAction(data: any) {
        this.rowClick.emit(data);
    }

    onSort(sort: ETSort) {
        this.sortingService.sort = sort;
        this.buildDataSource();
    }

    isSorted(columnId) {
        if (this.sortingService.sort?.active !== columnId) return 0;
        return this.sortingService.sort.direction;
    }

    toggleAll() {
        this.selectionService.toggleAll(this.dataService.data);
        if (this.selectionService.areAllSelected) {
            this.dataService.collapsedGroups.clear();
            this.buildDataSource();
        }
    }
}
