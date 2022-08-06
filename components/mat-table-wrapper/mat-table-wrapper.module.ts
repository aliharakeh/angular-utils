import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableWrapperComponent} from './component/mat-table-wrapper.component';
import {CallActionWthPipe} from './pipes/call-action-wth.pipe';
import {CdkTableModule} from '@angular/cdk/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    declarations: [
        MatTableWrapperComponent,
        CallActionWthPipe
    ],
    imports: [
        CommonModule,
        CdkTableModule,
        MatCheckboxModule,
        MatIconModule
    ],
    exports: [
        MatTableWrapperComponent,
        CallActionWthPipe
    ]
})
export class MatTableWrapperModule {}
