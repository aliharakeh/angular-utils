import {Component, Input} from '@angular/core';

@Component({
    selector: 'group-column-cell',
    templateUrl: './group-column-cell.component.html',
    styleUrls: ['./group-column-cell.component.scss']
})
export class GroupColumnCellComponent {
    @Input() group: any;
    @Input() groupCol: any;
    @Input() isFirst: boolean = false;
}
