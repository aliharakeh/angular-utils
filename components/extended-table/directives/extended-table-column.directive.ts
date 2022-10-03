import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
    selector: '[appETColumn]'
})
export class ETColumnDirective {

    @Input('appETColumn') columnId: string = '';

    constructor(public templateRef: TemplateRef<any>) { }
}
