import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
    selector: '[appExtendedTableColumn]'
})
export class ExtendedTableColumnDirective {

    @Input('appExtendedTableColumn') columnId: string = '';

    constructor(public templateRef: TemplateRef<any>) { }
}
