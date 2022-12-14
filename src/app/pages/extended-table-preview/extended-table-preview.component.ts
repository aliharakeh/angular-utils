import {Component} from '@angular/core';
import {
	ETColumn,
	ETDataGroupColumns,
	ETGroupByColumns,
	ETGroupingConfig,
	ETRowData
} from '../../components/extended-table/models/interfaces';
import {ETConfigService} from '../../components/extended-table/providers/extended-table-config.service';
import {ExtendedTableComponent} from '../../components/extended-table/component/extended-table.component';
import {ETColumnDirective} from '../../components/extended-table/directives/extended-table-column.directive';
import {data, TableData} from './table-datat';

@Component({
	selector: 'app-extended-table-preview',
	templateUrl: './extended-table-preview.component.html',
	styleUrls: ['./extended-table-preview.component.scss'],
	standalone: true,
	imports: [ExtendedTableComponent, ETColumnDirective],
	providers: []
})
export class ExtendedTablePreviewComponent {

	data: TableData[] = data;
	columns: ETColumn<TableData>[] = [
		{
			id: 'name',
			label: 'Name',
			sortBy: (a, b) => {
				const lastNameA = a.name.split(' ')[1];
				const lastNameB = b.name.split(' ')[1];
				return lastNameA.localeCompare(lastNameB);
			},
			sort: true
		},
		{
			id: 'email',
			label: 'Email'
		},
		{
			id: 'country',
			label: 'Country'
		},
		{
			id: 'comment',
			label: 'Comment'
		},
		{
			id: 'date',
			label: 'Date'
		},
		{
			id: 'test',
			label: 'test',
			custom: true
		}
	];
	groupByColumns: ETGroupByColumns<TableData> = [
		{
			columnId: 'email',
			getGroupingKey: data => {
				return data.email.split('@')[1].replace(/\..*/i, '');
			}
		}
	];
	groupingConfig: ETGroupingConfig<TableData> = {
		groupColspan: 3,
		alignGroupContent: 'left',
		getGroupLabel: groupData => {
			const sortedDates = groupData.map(d => new Date(d.date)).sort((a, b) => a.getTime() - b.getTime());
			return groupData[0].email + ` (${sortedDates[0].toLocaleDateString()} - ${sortedDates[sortedDates.length - 1].toLocaleDateString()})`;
		}
	};
	dataGroupColumns: ETDataGroupColumns<TableData> = [
		{
			columnId: 'comment',
			getLabel: groupData => `comments (${groupData.length})`
		}
	];
	getStatusColor = () => 'red';
	hiddenColumns: string[] = [];
	withSelection = true;
	linesPerRow = 2;

	constructor(private etConfigService: ETConfigService<TableData>) {}

	action(e: ETRowData<TableData>) {
		console.log(e);
		this.etConfigService.defaultTable.setHiddenColumns(['country']);
	}

}
