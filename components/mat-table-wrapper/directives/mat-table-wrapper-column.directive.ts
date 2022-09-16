import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
    selector: '[appMatTableWrapperColumn]'
})
export class MatTableWrapperColumnDirective {

    @Input('appMatTableWrapperColumn') columnId: string = '';

    constructor(public templateRef: TemplateRef<any>) { }
}
