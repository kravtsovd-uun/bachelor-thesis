<script>
	import { addDays, format } from 'date-fns';

	import { formatDashboardDate } from '$lib/serviceFunctions.js';
	import { Paginator } from '@skeletonlabs/skeleton';
	import TimeRecordCard from '$lib/components/client/dashboard/TimeRecordCard.svelte';

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

	// Group user's time records by date
	// Object with keys as unique sorted formatted days. Each key contains related time record which belongs to that day
	// e.g.: {"30.3.2025": [{...record1Data}, {...record2Data}], ...}
	$: groupedUserTimeRecords = data.userTimeRecords.items.reduce((acc, record) => {
		const date = new Date(record.dateFrom).toLocaleDateString('cs-CZ', {
			weekday: 'long',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		}); //Format time record date
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(record);
		return acc;
	}, {});

	const today = new Date().toLocaleDateString('cs-CZ', {
		weekday: 'long',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
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
	<section class="mt-8 flex flex-col space-y-16">
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
				{#each Object.entries(groupedUserTimeRecords) as [date, records]}
					<div class="flex w-full flex-col space-y-4">
						<h2 class="h2">
							{#if date === today}
								Dnes <small class="text-sm">({date})</small>
							{:else}
								{date}
							{/if}
						</h2>
						<div class="flex flex-wrap gap-6">
							{#each records as record}
								<TimeRecordCard
									groupName={record.expand.group.name}
									groupStudentCount={record.expand.group.max_students_count}
									groupStudentAgeFrom={record.expand.group.ageFrom}
									groupStudentAgeTo={record.expand.group.ageTo}
									room={record.room}
									date={record.dateFrom}
									schoolName={record.expand.school.name}
									timeFrom={record.dateFrom}
									timeTo={record.dateTo}
									notPrimarySchool={data?.user.employee_of[0] !== record.expand.school.id}
								/>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		{/key}
	</section>
</main>
