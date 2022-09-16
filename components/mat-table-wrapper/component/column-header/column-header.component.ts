import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableColumn} from '../../models/mat-table-wrapper-column';
import {SelectionService} from '../../providers/selection.service';

@Component({
  selector: 'column-header',
  templateUrl: './column-header.component.html',
  styleUrls: ['./column-header.component.scss']
})
export class ColumnHeaderComponent<T> {

    @Input() textColumn: TableColumn<T>;
    @Input() withSelection: boolean = false;
    @Input() isFirst: boolean = false;
    @Input() isSorted: number = 0;
    @Input() areAllSelected: boolean = false;

    @Output('toggleAll') toggleAllEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public selectionService: SelectionService<T>) {}

    get selection() {
        return this.selectionService.selection;
    }

    toggleAll() {
        this.toggleAllEvent.emit(true);
    }

}
