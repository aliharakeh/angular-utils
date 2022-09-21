import {Pipe, PipeTransform} from '@angular/core';

/**
 * A Pipe used in the template to call an action (a function) to prevent the excessive call of the
 * action on each change detection
 * */
@Pipe({
    name: 'callActionWith'
})
export class CallActionWithPipe implements PipeTransform {
    transform(action: any, ...args: any[]): unknown {
        return action(...args);
    }
}
