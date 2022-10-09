import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExtendedTablePreviewComponent} from './pages/extended-table-preview/extended-table-preview.component';
import {ETConfigService} from './components/extended-table/providers/extended-table-config.service';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'extended-table-preview',
				component: ExtendedTablePreviewComponent,
				providers: [ETConfigService]
			}
		]
	},
	{
		path: '**',
		redirectTo: 'extended-table-preview'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
