import {Component} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public links = [
		{ title: 'Extended Table Preview', route: 'extended-table-preview' }
	];
}
