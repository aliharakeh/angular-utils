import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableWrapperComponent} from './component/mat-table-wrapper.component';
import {CallActionWithPipe} from './pipes/call-action-with.pipe';
import {CdkTableModule} from '@angular/cdk/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {ColumnHeaderComponent} from './component/column-header/column-header.component';
import {ColumnCellComponent} from './component/column-cell/column-cell.component';
import {SelectionService} from './providers/selection.service';
import { MatTableWrapperColumnDirective } from './directives/mat-table-wrapper-column.directive';
import { GroupColumnCellComponent } from './component/group-column-cell/group-column-cell.component';
import {MatTableWrapperConfigService} from './providers/mat-table-wrapper-config.service';


@NgModule({
    declarations: [
        MatTableWrapperComponent,
        CallActionWithPipe,
        ColumnHeaderComponent,
        ColumnCellComponent,
        MatTableWrapperColumnDirective,
        GroupColumnCellComponent
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
        MatTableWrapperConfigService
    ],
    exports: [
        MatTableWrapperComponent,
        CallActionWithPipe,
        MatTableWrapperColumnDirective
    ]
})
export class MatTableWrapperModule {}
