<script>
    import {arraySum} from '@svizzle/utils';
	import * as _ from 'lamb';

	import {makeStandardKeyAdapter} from '$lib/app/utils/events.js';

	import {
		getPercent,
		getTruthyKeys,
		initSelectedFieldsMap,
		initSelectedFieldSetsMap,
		makeGetFieldSetsFor,
		makeGetSelectedFields
	} from './utils.js';

	export let coverage;
	export let fields;
	export let message;
	export let selectionMode;
	export let selectedFields;

	let highlightedFields = [];
	let columnsSelectedFieldSetsMap = [];
	let columnsSelectedFields = [];
	let rowsSelectedFieldsMap = [];

	let scrollX = 0;
	let scrollY = 0;

	const onScroll = ({target}) => {
		const {scrollLeft, scrollTop} = target;
		scrollX = scrollLeft;
		scrollY = scrollTop;
	};

	const setHighlightedFields = fields => {
		highlightedFields = fields;
	};
	const toggleColumn = rowId => {
		if (selectionMode !== 'columns') {
			return;
		}
		columnsSelectedFieldSetsMap[rowId] = !columnsSelectedFieldSetsMap[rowId];
	}

	const toggleRow = fieldName => {
		if (selectionMode !== 'rows') {
			return;
		}
		rowsSelectedFieldsMap[fieldName] = !rowsSelectedFieldsMap[fieldName];
	};

	const getSortedByCount = _.sortWith(
		[_.sorterDesc(_.getKey('count'))]
	);

	const  makeToggleRowKeyHandler = makeStandardKeyAdapter(toggleRow);
	const  makeToggleColumnKeyHandler = makeStandardKeyAdapter(toggleColumn);

	/* public prop initialisation */
	$: coverage = {
		fieldSetsMap: {},
		total: 0,
		...coverage
	}
	$: selectionMode = selectionMode || 'rows';
	$: selectionMode, (fields = fields && _.sort(fields) || []);

	/* derived vars and functions dependent on public props */
	$: ({fieldSetsMap, total} = coverage);
	$: fieldSets = _.values(fieldSetsMap);
	$: sortedFieldSets = getSortedByCount(fieldSets);
	$: selectionMode, columnsSelectedFieldSetsMap = initSelectedFieldSetsMap(fieldSets);
	$: selectionMode, rowsSelectedFieldsMap = initSelectedFieldsMap(fields);

	/* interaction dependent vars and functions */

	// column selection mode vars
	$: columnsSelectedFieldSetIds = getTruthyKeys(columnsSelectedFieldSetsMap);

	$: columnsGetSelectedFieldSets = makeGetFieldSetsFor(columnsSelectedFieldSetIds);
	$: columnsGetSelectedFields = makeGetSelectedFields(fields, columnsSelectedFieldSetIds);

	$: columnsSelectedFieldSets = columnsGetSelectedFieldSets(fieldSetsMap);
	$: columnsSelectedFields = columnsGetSelectedFields(fieldSetsMap);

	$: columnsSelectionCount = arraySum(_.map(columnsSelectedFieldSets, _.getKey('count')));

	// row selection mode vars
	$: rowsSelectedFieldNames = getTruthyKeys(rowsSelectedFieldsMap);
	$: rowsSelectedFieldSets = _.filter(
		fieldSets,
		fieldSet => _.everyIn(
			rowsSelectedFieldNames,
			fieldName => fieldSet.fields.includes(fieldName)
		)
	);
	$: rowsSelectedFieldSetsIds = _.map(rowsSelectedFieldSets, _.getKey('id'));
	$: rowsSelectionCount = arraySum(_.map(rowsSelectedFieldSets, _.getKey('count')));

	// shared by selection modes
	$: isFieldSelected = fieldName => selectionMode === 'rows'
		? rowsSelectedFieldsMap[fieldName]
		: columnsSelectedFields.includes(fieldName);

	$: isFieldSetSelected = fieldSetId => selectionMode === 'rows'
		? rowsSelectedFieldSetsIds.includes(fieldSetId)
		: columnsSelectedFieldSetsMap[fieldSetId];

	$: isCellSelected = (fieldName, fieldSetId) => selectionMode === 'rows'
		? rowsSelectedFieldsMap[fieldName]
		: columnsSelectedFieldSetsMap[fieldSetId];

	$: isCellActive = (fieldName, fieldSetId) => isFieldSetSelected(fieldSetId)
		&& isFieldSelected(fieldName);
	
	$: selectionCount = selectionMode === 'rows'
		? rowsSelectionCount
		: columnsSelectionCount;

	/* bound props */
	$: selectedFields = selectionMode === 'rows'
		? rowsSelectedFieldNames
		: columnsSelectedFields;

	/* rendering vars */
	$: partitionedFieldSets = _.flatten([
		getSortedByCount(rowsSelectedFieldSets),
		_.difference(sortedFieldSets, rowsSelectedFieldSets)
	])
	$: visibleFieldSets = _.takeFrom(partitionedFieldSets, 100);
	$: tableFields = _.flatten([
		columnsSelectedFields,
		_.difference(fields, columnsSelectedFields)
	]);

	$: message = `Selected count: ${selectionCount}/${total} - ${getPercent(selectionCount, total)}` || '';

	$: tableRows = [
		{
			id: 'percentage',
			isHeaderRow: true,
			fields: _.map(visibleFieldSets, ({id, count}) => ({
				id,
				value: getPercent(count, total),
			}))
		},
		{
			id: 'count',
			isHeaderRow: true,
			fields: _.map(visibleFieldSets, ({id, count}) => ({
				id,
				value: count,
			}))
		},
		..._.map(tableFields, fieldName => ({
			id: fieldName,
			fields: _.map(visibleFieldSets, fieldSet => ({
				id: fieldSet.id,
				value: fieldSet.fields.includes(fieldName),
			}))
		}))
	];

	$: style = `--scrollX: ${scrollX}px; --scrollY: ${scrollY}px;`;
</script>

<div class='CoverageTable' on:scroll={onScroll} {style}>
	{#if fields}
		<table>
			{#each tableRows as row}
				<tr>
					{#if row.isHeaderRow}
						<th
							class='corner {row.id}'
						>
							{row.id}
						</th>
					{:else}
						{@const fieldName = row.id}
						<th
							class='fieldName'
							class:clickable={selectionMode === 'rows'}
							class:highlighed={highlightedFields.includes(fieldName)}
							class:selectedHeader={isFieldSelected(fieldName)}
							on:click={() => toggleRow(fieldName)}
							on:keydown={makeToggleRowKeyHandler(fieldName)}
							tabindex='0'
						>
							{fieldName}
						</th>
					{/if}
					{#each row.fields as field}
						{@const fieldSetId = field.id}
						{@const fieldName = row.id}
						{#if row.isHeaderRow}
							<th
								class='fieldSet {row.id}'
								class:clickable={selectionMode === 'rows'}
								class:selectedHeader={isFieldSetSelected(fieldSetId)}
								on:click={() => toggleColumn(fieldSetId)}
								on:keydown={makeToggleColumnKeyHandler(fieldSetId)}
								tabindex='0'
							>
								{field.value}
							</th>
						{:else}
							<td
								class='field'
								class:memberField={field.value}
								class:selectedField={isCellSelected(fieldName, fieldSetId)}
								class:activeField={isCellActive(fieldName, fieldSetId)}
								on:mouseenter={() => setHighlightedFields(fields)}
								on:mouseleave={() => setHighlightedFields([])}
							>
								&nbsp;
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</table>
	{/if}
</div>

<style>
	.CoverageTable {
		display: grid;
		grid-template-columns: min-content 1fr;
		height: 100%;
		overflow: auto;
		user-select: none;
		width: 100%;
	}
	table {
		border-collapse: collapse;
		display: block;
		width: 100%;
	}
	th.fieldName, th.fieldSet {
		z-index: 2;
	}
	th.fieldSet {
		text-align: right;
		transform: translateY(var(--scrollY));
	}
	th.fieldName {
		text-align: left;
		transform: translateX(var(--scrollX));
	}
	th.corner {
		position: relative;
		transform: translate(var(--scrollX), var(--scrollY));
		z-index: 3;
	}
	th, td {
		padding: 0.5rem;
		text-align: right;
	}
	td {
		text-align: center;
		width: min-content;
		border: thin solid black;
		background: white;
	}

	th.corner {
		background: white;
	}
	th.fieldName, th.fieldSet {
		background: #FDC;
	}
	th.selectedHeader {
		background: palegreen;
	}
	.field {
		background: white;
	}
	.memberField {
		background: rgb(212, 192, 103);
	}
	.memberField.activeField {
		background: lightblue;
	}
	.headers {
		width: min-content;
	}
	.values {
		width: 100%;
		height: 100%;
		overflow: auto;
	}
	.headers, .values {
		display: inline-block;
		vertical-align: top;
		white-space: nowrap;
	}

	.clickable {
		cursor: pointer;
	}

/*
 	.highlighed {
		color: yellow;
	}
*/
</style>
