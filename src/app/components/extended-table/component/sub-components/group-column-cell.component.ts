import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CallActionWithPipe} from '../../pipes/call-action-with.pipe';

@Component({
	selector: 'group-column-cell',
	template: `
        <div class="et-cell">
            <div class="et-cell-wrapper">
                <ng-container *ngIf="isFirst">
                    <span class="et-mr et-sort et-sort-asc" *ngIf="!group.isReduced; else elseBlock"></span>
                    <ng-template #elseBlock>
                        <span class="et-mr et-sort et-sort-desc"></span>
                    </ng-template>
                </ng-container>
                <div
                    class="et-truncate"
                    [style.text-align]="groupCol.alignContent"
                    [title]="groupCol.getLabel | callActionWith: group.groupData"
                >
                    {{ groupCol.getLabel | callActionWith: group.groupData }}
                </div>
            </div>
        </div>
    `,
	standalone: true,
	imports: [CommonModule, CallActionWithPipe]
})
export class GroupColumnCellComponent {
	@Input() group: any;
	@Input() groupCol: any;
	@Input() isFirst: boolean = false;
}
