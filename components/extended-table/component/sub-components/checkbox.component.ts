import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'checkbox',
    template: `
        <div
            class="et-checkbox"
            [ngClass]="{'et-checked': checked, 'et-indeterminate': indeterminate && !checked}"
            (click)="onCheck($event)"
        ></div>
    `
})
export class CheckboxComponent {
    @Input() checked: boolean = false;
    @Input() indeterminate: boolean = false;
    @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

    onCheck(event) {
        event.stopPropagation();
        this.indeterminate = false;
        this.checked = !this.checked;
        this.change.emit(this.checked);
    }
}
