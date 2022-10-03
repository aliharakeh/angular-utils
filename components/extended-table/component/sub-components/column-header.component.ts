import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectionService} from '../../providers/selection.service';
import {TableColumn} from '../../models/implementations';
import {ETSort} from '../../models/interfaces';

@Component({
    selector: 'column-header',
    template: `
        <div class="et-header-cell" [style]="textColumn?.headerStyles" (click)="sort()">
            <div class="et-cell-wrapper">
                <!-- Master Columns Selection -->
                <checkbox
                    *ngIf="withSelection && isFirst"
                    class="et-mr"
                    [checked]="selectionService.hasValue() && selectionService.areAllSelected"
                    [indeterminate]="selectionService.hasValue() && !selectionService.areAllSelected"
                    (change)="toggleAll()"
                ></checkbox>
                <!-- Column Label -->
                <div
                    class="line-clamp"
                    [title]="textColumn.label"
                    [style.text-align]="textColumn?.alignContent"
                >
                    {{ textColumn.label }}
                </div>
                <!-- sort mode -->
                <ng-container *ngIf="sortMode">
                    <span class="et-ml et-arrow et-arrow-up" *ngIf="sortMode > 0; else elseBlock"></span>
                    <ng-template #elseBlock>
                        <span class="et-ml et-arrow et-arrow-down"></span>
                    </ng-template>
                </ng-container>
            </div>
        </div>
    `
})
export class ColumnHeaderComponent<T> {
    @Input() textColumn: TableColumn<T>;
    @Input() withSelection: boolean = false;
    @Input() isFirst: boolean = false;
    @Input() sortMode: number;

    @Output('toggleAll') toggleAllEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output('sort') sortEvent: EventEmitter<ETSort> = new EventEmitter<ETSort>();

    constructor(public selectionService: SelectionService<T>) {}

    toggleAll() {
        this.toggleAllEvent.emit(true);
    }

    sort() {
        let sortDirection;
        switch (true) {
            case this.sortMode === 0:
                sortDirection = 1;
                break;
            case this.sortMode > 0:
                sortDirection = -1;
                break;
            case this.sortMode < 0:
                sortDirection = 0;
                break;
            default:
                sortDirection = 1;
                break;
        }
        this.sortEvent.emit({
            active: this.textColumn.id,
            direction: sortDirection
        });
    }

}
