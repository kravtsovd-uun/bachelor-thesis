<script>
	import { addDays } from 'date-fns';

	import { formatDashboardDate } from '$lib/serviceFunctions.js';
	import { Paginator } from '@skeletonlabs/skeleton';

	function _processDays() {
		let daysDuration = 7; // 1 week
		let daysArr = [new Date()];

		for (let i = 1; i <= daysDuration; i++) {
			daysArr.push(addDays(new Date(), i));
		}

		return daysArr;
	}

	let processedDaysDuration = _processDays();
	let daysData = formatDashboardDate(processedDaysDuration);

	export let data;
	let updatedUserTRData;
	let isFetchPending = false;

	let paginationSettings = {
		page: data.userTimeRecords.page - 1,
		limit: data.userTimeRecords.perPage,
		size: data.userTimeRecords.totalItems,
		amounts: [10, 20, 50]
	};

	$: paginationSettings.size = data.userTimeRecords.totalItems;

	async function onPageChange(event) {
		isFetchPending = true;
		const response = await fetch(`/api/dashboard/fetch-time-records?page=${event.detail + 1}`);
		const result = await response.json();

		updatedUserTRData = result;
		isFetchPending = false;
	}
</script>

<main class="p-4">
	<h1 class="h1 font-bold text-surface-200">Rozvrh uživatele {data.user.name}</h1>
	<Paginator
		settings={paginationSettings}
		showNumerals
		maxNumerals={3}
		class="mt-4 max-w-xs"
		on:page={onPageChange}
		disabled={isFetchPending}
	/>
	<section class="flex flex-wrap gap-8">
		{#key updatedUserTRData}
			{#if isFetchPending}
				<section class="card mt-4 w-full">
					<h2 class="h2 p-4 text-2xl text-surface-200">Nahrávám položky rozvrhu...</h2>
					<div class="space-y-4 p-4">
						<div class="placeholder animate-pulse" />
						<div class="grid grid-cols-3 gap-8">
							<div class="placeholder animate-pulse" />
							<div class="placeholder animate-pulse" />
							<div class="placeholder animate-pulse" />
						</div>
						<div class="grid grid-cols-4 gap-4">
							<div class="placeholder animate-pulse" />
							<div class="placeholder animate-pulse" />
							<div class="placeholder animate-pulse" />
							<div class="placeholder animate-pulse" />
						</div>
					</div>
				</section>
			{:else}
				{#each updatedUserTRData?.items ?? data?.userTimeRecords.items as userTimeRecord, i}
					<div class="mt-4 rounded-lg bg-surface-500 p-4 text-2xl font-bold text-surface-200">
						<div>
							Od: {new Date(userTimeRecord.dateFrom).toLocaleString('cs-CZ', {
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</div>
						<div>
							Do: {new Date(userTimeRecord.dateTo).toLocaleString('cs-CZ', {
								year: 'numeric',
								month: 'numeric',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</div>
						<div>Resitel: {userTimeRecord.expand.teacher.name}</div>
						<div>Škola: {userTimeRecord.expand.school.name}</div>
						<div>Skupina: {userTimeRecord.expand.group.name}</div>
						<div>Místnost: {userTimeRecord.room}</div>
					</div>
				{/each}
			{/if}
		{/key}
	</section>
</main>
