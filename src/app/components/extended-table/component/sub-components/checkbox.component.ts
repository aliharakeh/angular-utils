import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'checkbox',
	template: `
        <div
            class="et-checkbox"
            [ngClass]="{'et-checked': checked, 'et-indeterminate': indeterminate && !checked}"
            (click)="onCheck($event)"
        ></div>
    `,
	standalone: true,
	imports: [CommonModule]
})
export class CheckboxComponent {
	@Input() checked: boolean = false;
	@Input() indeterminate: boolean = false;
	@Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

	onCheck(event: MouseEvent) {
		event.stopPropagation();
		this.indeterminate = false;
		this.checked = !this.checked;
		this.change.emit(this.checked);
	}
}
