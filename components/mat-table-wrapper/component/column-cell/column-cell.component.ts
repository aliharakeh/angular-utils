import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableColumn} from '../../models/mat-table-wrapper-column';
import {SelectionService} from '../../providers/selection.service';
import {MatTableWrapperRowData} from '../../models/mat-table-wrapper-row-data';

@Component({
    selector: 'column-cell',
    templateUrl: './column-cell.component.html',
    styleUrls: ['./column-cell.component.scss']
})
export class ColumnCellComponent<T> {

    @Input() textColumn: TableColumn<T>;
    @Input() row: MatTableWrapperRowData<T>;
    @Input() withSelection: boolean = false;
    @Input() isFirst: boolean = false;

    constructor(public selectionService: SelectionService<T>) {}

    get selection() {
        return this.selectionService.selection;
    }

    toggle(row) {
        this.selectionService.toggle(row);
    }

}
