import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'callActionWith'
})
export class CallActionWthPipe implements PipeTransform {
    transform(action: any, ...args: any[]): unknown {
        return action(...args);
    }
}
