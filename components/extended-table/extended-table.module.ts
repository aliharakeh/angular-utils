import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExtendedTableComponent} from './component/extended-table.component';
import {CallActionWithPipe} from './pipes/call-action-with.pipe';
import {CdkTableModule} from '@angular/cdk/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {ColumnHeaderComponent} from './component/column-header/column-header.component';
import {ColumnCellComponent} from './component/column-cell/column-cell.component';
import {SelectionService} from './providers/selection.service';
import { ExtendedTableColumnDirective } from './directives/extended-table-column.directive';
import { GroupColumnCellComponent } from './component/group-column-cell/group-column-cell.component';
import {ExtendedTableConfigService} from './providers/extended-table-config.service';
import { CheckboxComponent } from './component/checkbox/checkbox.component';


@NgModule({
    declarations: [
        ExtendedTableComponent,
        CallActionWithPipe,
        ColumnHeaderComponent,
        ColumnCellComponent,
        ExtendedTableColumnDirective,
        GroupColumnCellComponent,
        CheckboxComponent
    ],
    imports: [
        CommonModule,
        CdkTableModule,
        MatCheckboxModule,
        MatIconModule,
        MatSortModule
    ],
    providers: [
        SelectionService,
        ExtendedTableConfigService
    ],
    exports: [
        ExtendedTableComponent,
        CallActionWithPipe,
        ExtendedTableColumnDirective
    ]
})
export class ExtendedTableModule {}
