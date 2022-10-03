import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExtendedTableComponent} from './component/extended-table.component';
import {CallActionWithPipe} from './pipes/call-action-with.pipe';
import {ColumnHeaderComponent} from './component/sub-components/column-header.component';
import {ColumnCellComponent} from './component/sub-components/column-cell.component';
import {SelectionService} from './providers/selection.service';
import {ETColumnDirective} from './directives/extended-table-column.directive';
import {GroupColumnCellComponent} from './component/sub-components/group-column-cell.component';
import {ETConfigService} from './providers/extended-table-config.service';
import {CheckboxComponent} from './component/sub-components/checkbox.component';


@NgModule({
    declarations: [
        ExtendedTableComponent,
        CallActionWithPipe,
        ColumnHeaderComponent,
        ColumnCellComponent,
        ETColumnDirective,
        GroupColumnCellComponent,
        CheckboxComponent
    ],
    imports: [CommonModule],
    providers: [ETConfigService],
    exports: [
        ExtendedTableComponent,
        CallActionWithPipe,
        ETColumnDirective,
    ]
})
export class ExtendedTableModule {}
