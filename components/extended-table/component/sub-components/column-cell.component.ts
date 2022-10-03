import {Component, Input} from '@angular/core';
import {SelectionService} from '../../providers/selection.service';
import {TableColumn} from '../../models/implementations';
import {ETRowData} from '../../models/interfaces';

@Component({
    selector: 'column-cell',
    template: `
        <div class="et-cell" [style]="textColumn?.cellStyles">
            <div class="et-cell-wrapper">
                <checkbox
                    *ngIf="withSelection && isFirst"
                    class="et-mr"
                    [checked]="selectionService.isSelected(row)"
                    (change)="selectionService.toggle(row)"
                ></checkbox>
                <ng-content></ng-content>
            </div>
        </div>
    `
})
export class ColumnCellComponent<T> {
    @Input() textColumn: TableColumn<T>;
    @Input() row: ETRowData<T>;
    @Input() withSelection: boolean = false;
    @Input() isFirst: boolean = false;

    constructor(public selectionService: SelectionService<T>) {}
}
