import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'action'
})
export class ActionPipe implements PipeTransform {
    transform(args: any, action: any): unknown {
        if (Array.isArray(args)) {
            return action(...args);
        }
        return action(args);
    }
}
