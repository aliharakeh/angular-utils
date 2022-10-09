import {Component, Input} from '@angular/core';
import {SelectionService} from '../../providers/selection.service';
import {TableColumn} from '../../models/implementations';
import {ETRowData} from '../../models/interfaces';
import {CommonModule} from '@angular/common';
import {CheckboxComponent} from './checkbox.component';
import {CallActionWithPipe} from '../../pipes/call-action-with.pipe';

@Component({
	selector: 'column-cell',
	template: `
        <div class="et-cell" [style]="textColumn.cellStyles">
            <div class="et-cell-wrapper">
                <checkbox
                    *ngIf="withSelection && isFirst"
                    class="et-mr"
                    [checked]="isSelected.bind(this) | callActionWith: row"
                    (change)="selectionService.toggle(row)"
                ></checkbox>
                <ng-content></ng-content>
            </div>
        </div>
	`,
	standalone: true,
	imports: [CommonModule, CheckboxComponent, CallActionWithPipe]
})
export class ColumnCellComponent<T> {
	@Input() textColumn!: TableColumn<T>;
	@Input() row!: ETRowData<T>;
	@Input() withSelection: boolean = false;
	@Input() isFirst: boolean = false;

	constructor(public selectionService: SelectionService<T>) {}

	isSelected(data: ETRowData<T>) {
		this.selectionService.isSelected(data);
	}
}
