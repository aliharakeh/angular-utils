import {Pipe, PipeTransform} from '@angular/core';

/**
 * A Pipe used in the template to call an action (a function) to prevent the excessive call of the
 * action on each change detection
 * */
@Pipe({
	name: 'callActionWith',
	standalone: true
})
export class CallActionWithPipe implements PipeTransform {
	transform(action: any, ...args: any[]): any {
		return action(...args);
	}
}
