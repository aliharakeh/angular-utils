import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableWrapperComponent} from './component/mat-table-wrapper.component';
import {ActionPipe} from './pipes/action.pipe';
import {CdkTableModule} from '@angular/cdk/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    declarations: [
        MatTableWrapperComponent,
        ActionPipe
    ],
    imports: [
        CommonModule,
        CdkTableModule,
        MatCheckboxModule,
        MatIconModule
    ],
    exports: [
        MatTableWrapperComponent,
        ActionPipe
    ]
})
export class MatTableWrapperModule {}
